from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=schemas.OrderResponse, status_code=201)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db)):
    # verify customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # start order
    db_order = models.Order(customer_id=order_data.customer_id, total_amount=0.0)
    db.add(db_order)
    db.flush()  # get order.id

    total_amount = 0.0
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).with_for_update().first()
        if not product:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"Product id {item.product_id} not found")
        if product.quantity < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, requested: {item.quantity}"
            )
        # deduct stock
        product.quantity -= item.quantity
        # create order item with price snapshot
        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price
        )
        total_amount += item.quantity * product.price
        db.add(order_item)

    db_order.total_amount = round(total_amount, 2)
    db.commit()
    db.refresh(db_order)

    # build response with proper field names
    return {
        "id": db_order.id,
        "customer_id": db_order.customer_id,
        "customer_name": customer.full_name,
        "total_amount": db_order.total_amount,
        "created_at": db_order.created_at.isoformat(),
        "items": [
            {
                "id": oi.id,
                "product_id": oi.product_id,
                "product_name": oi.product.name,
                "quantity": oi.quantity,
                "unit_price": oi.unit_price,
                "total_price": round(oi.quantity * oi.unit_price, 2)
            }
            for oi in db_order.items
        ]
    }

@router.get("/", response_model=List[schemas.OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "customer_id": order.customer_id,
            "customer_name": order.customer.full_name,
            "total_amount": order.total_amount,
            "created_at": order.created_at.isoformat(),
            "items": [
                {
                    "id": oi.id,
                    "product_id": oi.product_id,
                    "product_name": oi.product.name,
                    "quantity": oi.quantity,
                    "unit_price": oi.unit_price,
                    "total_price": round(oi.quantity * oi.unit_price, 2)
                }
                for oi in order.items
            ]
        })
    return result

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.full_name,
        "total_amount": order.total_amount,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "id": oi.id,
                "product_id": oi.product_id,
                "product_name": oi.product.name,
                "quantity": oi.quantity,
                "unit_price": oi.unit_price,
                "total_price": round(oi.quantity * oi.unit_price, 2)
            }
            for oi in order.items
        ]
    }

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # restore stock
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity
    db.delete(order)
    db.commit()
    return {"detail": "Order cancelled, stock restored"}
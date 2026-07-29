"""initial_migration

Revision ID: 001_initial
Revises: 
Create Date: 2026-07-29 22:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('role', sa.String(), server_default='USER'),
        sa.Column('avatar', sa.String(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
        sa.Column('updatedAt', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Addresses
    op.create_table(
        'addresses',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('userId', sa.String(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(), server_default='SHIPPING'),
        sa.Column('street', sa.String(), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('state', sa.String(), nullable=False),
        sa.Column('zipCode', sa.String(), nullable=False),
        sa.Column('country', sa.String(), server_default='United States'),
        sa.Column('isDefault', sa.Boolean(), server_default='false'),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
    )

    # Categories
    op.create_table(
        'categories',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('name', sa.String(), nullable=False, unique=True),
        sa.Column('slug', sa.String(), nullable=False, unique=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image', sa.String(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)

    # Products
    op.create_table(
        'products',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('slug', sa.String(), nullable=False, unique=True),
        sa.Column('subtitle', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('compareAtPrice', sa.Float(), nullable=True),
        sa.Column('stock', sa.Integer(), server_default='100'),
        sa.Column('categoryId', sa.String(), sa.ForeignKey('categories.id', ondelete='CASCADE'), nullable=False),
        sa.Column('images', sa.Text(), nullable=False),
        sa.Column('specs', sa.Text(), nullable=False),
        sa.Column('isFeatured', sa.Boolean(), server_default='false'),
        sa.Column('isNew', sa.Boolean(), server_default='true'),
        sa.Column('rating', sa.Float(), server_default='5.0'),
        sa.Column('reviewsCount', sa.Integer(), server_default='0'),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
        sa.Column('updatedAt', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_products_slug'), 'products', ['slug'], unique=True)

    # Reviews
    op.create_table(
        'reviews',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('userId', sa.String(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('productId', sa.String(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('isVerified', sa.Boolean(), server_default='true'),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
    )

    # Orders
    op.create_table(
        'orders',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('orderNumber', sa.String(), nullable=False, unique=True),
        sa.Column('userId', sa.String(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('totalAmount', sa.Float(), nullable=False),
        sa.Column('discountAmount', sa.Float(), server_default='0.0'),
        sa.Column('shippingFee', sa.Float(), server_default='0.0'),
        sa.Column('status', sa.String(), server_default='PROCESSING'),
        sa.Column('paymentStatus', sa.String(), server_default='PAID'),
        sa.Column('shippingAddress', sa.Text(), nullable=False),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
        sa.Column('updatedAt', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_orders_orderNumber'), 'orders', ['orderNumber'], unique=True)

    # Order Items
    op.create_table(
        'order_items',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('orderId', sa.String(), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('productId', sa.String(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1'),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('size', sa.String(), nullable=True),
    )

    # Coupons
    op.create_table(
        'coupons',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('code', sa.String(), nullable=False, unique=True),
        sa.Column('discountType', sa.String(), server_default='PERCENTAGE'),
        sa.Column('discountValue', sa.Float(), nullable=False),
        sa.Column('minOrderValue', sa.Float(), server_default='0.0'),
        sa.Column('maxUses', sa.Integer(), server_default='1000'),
        sa.Column('usedCount', sa.Integer(), server_default='0'),
        sa.Column('expiresAt', sa.DateTime(), nullable=True),
        sa.Column('isActive', sa.Boolean(), server_default='true'),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
    )
    op.create_index(op.f('ix_coupons_code'), 'coupons', ['code'], unique=True)

    # Wishlist Items
    op.create_table(
        'wishlist_items',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('userId', sa.String(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('productId', sa.String(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('createdAt', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('userId', 'productId', name='_user_product_uc'),
    )

def downgrade() -> None:
    op.drop_table('wishlist_items')
    op.drop_table('coupons')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('reviews')
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('addresses')
    op.drop_table('users')

"""follow_data v1

Revision ID: 360089a244f8
Revises: 74f17f2f59c1
Create Date: 2024-11-11 14:49:05.920194

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '360089a244f8'
down_revision = '74f17f2f59c1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('follow_data',
    sa.Column('followed_by_id', sa.Integer(), nullable=False),
    sa.Column('following_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['followed_by_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['following_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('followed_by_id', 'following_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('follow_data')
    # ### end Alembic commands ###

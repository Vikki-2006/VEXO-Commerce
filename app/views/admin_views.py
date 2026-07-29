from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(prefix="/admin", tags=["Admin Views"])
templates = Jinja2Templates(directory="app/templates")

@router.get("", response_class=HTMLResponse)
@router.get("/", response_class=HTMLResponse)
def view_admin_dashboard(request: Request):
    return templates.TemplateResponse(request=request, name="admin/dashboard.html")

@router.get("/products", response_class=HTMLResponse)
def view_admin_products(request: Request):
    return templates.TemplateResponse(request=request, name="admin/products.html")

@router.get("/orders", response_class=HTMLResponse)
def view_admin_orders(request: Request):
    return templates.TemplateResponse(request=request, name="admin/orders.html")

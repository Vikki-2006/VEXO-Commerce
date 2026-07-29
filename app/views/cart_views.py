from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(tags=["Cart Views"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/cart", response_class=HTMLResponse)
def view_cart(request: Request):
    return templates.TemplateResponse(request=request, name="cart.html")

@router.get("/checkout", response_class=HTMLResponse)
def view_checkout(request: Request):
    return templates.TemplateResponse(request=request, name="checkout.html")

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter(tags=["Account Views"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/account", response_class=HTMLResponse)
@router.get("/profile", response_class=HTMLResponse)
def view_account(request: Request):
    return templates.TemplateResponse(request=request, name="account.html")

@router.get("/orders", response_class=HTMLResponse)
def view_orders(request: Request):
    return templates.TemplateResponse(request=request, name="orders.html")

@router.get("/wishlist", response_class=HTMLResponse)
def view_wishlist(request: Request):
    return templates.TemplateResponse(request=request, name="wishlist.html")

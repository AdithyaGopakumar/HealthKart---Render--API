## page 1 home page

> ## all products

> all products
> \*http://localhost:9800/allproducts
> brands api
> http://localhost:9800/brands
> category api
> http://localhost:9800/categories
> flash sale api
> \*http://localhost:9800/allproducts/flashsale
> trending now api
> \*http://localhost:9800/allproducts/trending
> tending in whey protien api
> \*http://localhost:9800/allproducts/trendingwhey
> gaining supplements api
> \*http://localhost:9800/allproducts/gainers

## page 2 individual brand page

> products per brand api
> \*http://localhost:9800/allproducts?brandId=1
> products based on category
> \*http://localhost:9800/allproducts?categoryId=5
> products based on brand and category
> http://localhost:9800/filter/7?categoryId=5
> products based on category and brand

> products based on brand category and price
> http://localhost:9800/filter/2?categoryId=2&hcost=3000&lcost=1000
> sort on the basis of cost(hcost and lcost)
> \*http://localhost:9800/filter/1?hcost=2000&lcost=1000
> sort on the basis of cost(high and low)
> \*by default it is in accending order
> \*for descending order http://localhost:9800/filter/7?categoryId=2&sort=-1

## page 3 individual product page

> details of the product api
> \*http://localhost:9800/brands/50
> category with respect to product

> Add to cart(POST)

## page 4 cart

> cart details(POST)
> http://localhost:9800/cart(pass in
> {

    "id": [
        11,22,33,44,55
    ]

})

> place order(POST)
> \*http://localhost:9800/placeOrder(Pass in
> {

        "_id": "636f392457424adaec829aaa",
        "order_id": 1,
        "name": "Adithya Gopakumar",
        "email": "adi@123.com",
        "address": "home, city, pin",
        "phone": 837564056,
        "total": 2354,
        "items": [
            1,
            32,
            51
        ]
    },)

## page 5 order confimation page

> list of orders
> \*http://localhost:9800/orders
> list of orders with respect to email
> \*http://localhost:9800/orders?email=adi@123.com

> update payment details(PUT)
> \*http://localhost:9800/updateOrder/1(put
> {

    "status": "Txn Success",
    "bank_name": "HDFC",
    "date": "16/11/2022"

})

> delete order(DELETE)(just pass the order's \_id)
> \*http://localhost:9800/deleteOrder/636f392457424adaec829aaa

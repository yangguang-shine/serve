# 表大致结构

## shopList                     店铺列表表

    shopID              number      店铺ID              主键
    shopName            string      店铺名称
    address             string      店铺地址
    startTime           string      营业开始时间
    endTime             string      营业结束时间
    imgUrl              string      店铺图片地址
    minus               string      店铺满减信息
    businessTypes       string      店铺业务类型
    manageID            number      店铺管理员ID

## categor_list_shopID          菜品分类表

    categoryID          number      菜品分类ID          主键
    categoryName        string      菜品分类名称
    shopID              number      菜品所属的店铺ID        （可能多余)

## food_info_shopID             菜品详情表

    foodID              number      菜品ID              主键
    foodName            string      菜品名称
    categoryID          number      所属菜品分类
    categoryName        string      所属菜品分类名称
    price               string      菜品价格
    unit                string      菜品规格
    orderCount          number      下单菜品个数
    imgUrl              string      菜品图片地址
    description         string      菜品描述
    shopID              number      所属店铺ID             （可能多余)

## order_food_list_(userID or shopID)   下单的菜品列表

    id                  number      索引                主键
    foodID              number      菜品ID
    foodName            string      菜品名称
    categoryID          number      所属菜品分类
    categoryName        string      所属菜品分类名称
    price               string      菜品价格
    unit                string      菜品规格
    orderCount          number      下单菜品个数
    imgUrl              string      菜品图片地址
    description         string      菜品描述
    orderKey            string      订单号

## order_key_list_(userID or shopID)     下单的订单列表

    orderKey            string      订单号        
    orderKeyID          number      索引                主键
    shopID              number      订单所属店铺ID
    orderAmount         string      订单实际支付金额 
    orderTime           string      下单时间
    busineType          number      下单类型
    minusPrice          number      满减价格
    takeOutTime         string      外卖送达时间
    address             string      外卖送达地址
    orderStatus         number      订单状态
    originOrderAmount   string      订单最原始价格

## address_list_userID        用户地址列表

    addressID           number      地址ID              主键
    name                string      姓名
    mobile              string      电话号码
    address1            string      粗略地址
    address2            string      详细地址
    sex                 number      性别

## (manage or user)_token_store     用户或管理员 token 列表

    userID/manageID         number      用户或管理员ID      主键
    id                      number      索引        
    userToken/manageToken   number      用户或管路员 Token      (通过 token 获取用户或管理员ID)
    secret                  string      微信小程序使用

## (user or manage)_info_pass

    openid
    session_key
    userID/manageID         

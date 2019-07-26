const router = require('koa-router')()

router.prefix('/api/foodInfo')
// 添加菜品
router.post('/add', async (ctx, next) => {
    console.log(111)
    ctx.render("food.ejs", {});
    console.log('添加菜品')
})

// 删除菜品
router.post('/delete', async (ctx, next) => {
    console.log('删除菜品')
})

// 更新菜品
router.post('/update', async (ctx, next) => {
    console.log('更新菜品')
})

// 查找菜品
router.get('/find', async (ctx, next) => {
    ctx.querySQL('select * from food_info')
    console.log('查找菜品')
})

// 上传图片
router.post('/foodImgUpload', async (ctx, next) => {
    console.log('查找菜品')
})

module.exports = router

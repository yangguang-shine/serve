// this 指向 ctx
const { toBulkImportFood } = require('../_manageCommonTool')

module.exports = async function bulkImportFood() {
    const { categoryList, shopID } = this.request.body
    if (!(shopID && categoryList.length)) {
        this.body = this.parameterError
        return
    }
    await toBulkImportFood(this, {
        shopID,
        categoryList
    })
    this.body = {
        code: '000',
        msg: '更新成功',
        data: null
    }
}
export interface CarouselImage {
    image: string;
    alt: string;
    index: number;
}

export interface CarouselImageResponseVO {
    /** 主键ID */
    id: string;

    /** 品牌代码，如 HL01 */
    brandCode: string;

    /** 渠道代码，如 201 */
    channelCode: string;

    /** 资源代码，如 RS00000002 */
    resourceCode: string;

    /** 页面代码，如 page001 */
    pageCode: string;

    /** 页面名称，如 首页轮播 */
    pageName: string;

    /** 业务开始时间（格式：YYYY-MM-DD HH:mm:ss） */
    businessStartTime: string;

    /** 业务结束时间（格式：YYYY-MM-DD HH:mm:ss） */
    businessEndTime: string;

    /** 时段标识，例如 period1 */
    dayPart: string;

    /** 操作区域代码，如 oper001 */
    operationAreaCode: string;

    /** 操作区域名称，如 首页轮播图 */
    operationAreaName: string;

    /** 操作人名称 */
    operateName: string;

    /** 门店代码集合（逗号分隔） */
    storeCode: string;

    /** 创建时间 */
    createTime: string;

    /** 更新时间 */
    updateTime: string;

    /** 删除标志：0=未删除，1=已删除 */
    deleted: number;

    /** 状态：1=启用，0=停用 */
    status: number;

    /**
     * 图片数据（后端返回为字符串，需解析为 JSON 数组）
     * CarouselImage
     */
    pics: string;
}


export const StoreCarouselConstants = {
    /** 门店轮播图资源位编码 */
    PAGE_CODE: 'page001',
    /** 门店轮播图操作区域编码 */
    OPERATION_AREA_CODE: 'oper001',
};


import {
    ProductType,
    StockStatusEnums,
    UpLowStatusEnum,
} from '@app/shared/constants/menu.constants';
import { MenuGrillItem, MenuRoundItem, MenuSpecItem } from '@app/shared/types/menu.shared.types';
import { TaxTypeEnums } from '@app/shared/constants/tax.enums';

/**
 * @desc 套餐轮次组
 */
export interface ComboRoundItem {
    roundId: number;
    min: number; // 默认 1
    max: number;
    itemList: ComboSkuItem[];
}

/** 套餐子项中的SKU项 */
export interface ComboSkuItem {
    skuId: string;
    quantity: number; // 默认1
    price: number;
}

/**
 * @desc 单品加料组
 */
export interface GrillItem {
    grillId: string;
    itemList: GrillItemSku[];
}

/**
 * @desc 单品加料组子项
 */
export interface GrillItemSku {
    productId: string;
    price: number;
    quantity: number; // 默认1
}

/**
 * @desc 购物车扩展字段 - 属于共享性质
 */
export interface CartExtra {
    // 单品字段
    skuId?: string; // 规格ID(单品)
    skuPrice?: number; // 规格价格(单品)
    grillList?: GrillItem[]; // 加料 ID(单品)

    // 套餐字段
    rounds?: ComboRoundItem[];
}

/**
 * @desc 税费字段
 */
export interface CartTaxTypes {
    /* ------------------ 🧾 税费与金额相关（计算后生成，可选） ------------------ */
    /** 页面展示总价（已含内含税 + 外税） */
    subtotal?: number;

    /** 菜单显示小计（含内含税，但不含外税） */
    displaySubtotal?: number;

    /** 税前金额（未含任何消费税） */
    priceExcludingInternalTax?: number;

    /** 内含税金额（该菜品本身价格中已含的消费税部分） */
    internalTax?: number;

    /** 外含税金额（需额外加在价格上的消费税部分） */
    externalTax?: number;

    /* ------------------ 📊 辅助信息 ------------------ */

    /** 适用税种类型 */
    taxType?: TaxTypeEnums | string;

    /** 消费税税率 */
    taxRate?: number | string;
}

/**
 * @desc 购物车汇总数据
 */
export interface ShopCartSummary {
    /** 小费金额 */
    tip?: number;

    /** 订单总价（已含内含税 + 外税） */
    orderTotal?: number;

    /** 商品数量 */
    count: number;

    /* ------------------ 💰 附加费（如果存在） ------------------ */

    /** 附加费金额 */
    surchargeAmount?: number;

    /** 附加费对应消费税 */
    surchargeTaxAmount?: number;

    /* ------------------ 💳 支付相关 ------------------ */

    /** 支付手续费（如信用卡） 暂未使用 */
    paymentFee?: number;

    /** 最终应支付金额（含所有税费, 包含小费） */
    total: number;

    /* ------------------ 📊 辅助信息 ------------------ */

    /** 消费税税率 */
    taxRate?: number | string;
}

/**
 * @desc 购物车菜品子项 - 原始数据
 * 单品唯一ID设计： productType + productId + skuId + (n * (grillId + n * productId))
 * 组合唯一ID设计： productType + productId + (n * (roundId + n * skuId))
 */
export interface ShopCartProductOrigin {
    cartId: string; // 购物车组合唯一ID
    productType: ProductType | string; // 商品类型(单品、套餐）
    productId: string; // 商品ID
    quantity: number;
    price: number;
    subtotal?: number;
    /** 菜单显示小计（含内含税，但不含外税） */
    displaySubtotal?: number;
    taxData?: CartTaxTypes; // 税费数据
    taxGroupCode?: string; // 税率组编码
}
/** @desc 购物车菜品子项 - 包含扩展字段与税费字段 */
export type ShopCartProduct = ShopCartProductOrigin & CartExtra;

/**
 * @desc 购物车展示列表Item
 */
export type cartViewItem = {
    // 菜品售罄恢复状态
    stockStatus?: StockStatusEnums | string;
    // 上下架状态
    upLowStatus?: UpLowStatusEnum | string;
    taxData?: CartTaxTypes; // 税费数据
    cartId: string;
    productId: string;
    productName: string;
    imageUrl: string;
    productType: string | ProductType;
    price: number; // 商品单价
    subtotal?: number; // 用于缓存小计
    quantity: number;
    spec?: MenuSpecItem; // 单品规格
    grill?: MenuGrillItem[]; // 单品加料
    rounds?: MenuRoundItem[]; // 套餐轮次
};

/**
 * @desc 售罄项
 */
export interface SoldOutItem {
    productName: string; // 商品名
    specName: string; // 规格名
    extras: {
        // 加料列表
        parentName: string; // 加料组名
        name: string;
        soldOut: boolean; // 是否售罄
    }[];
    subItems: {
        // 子项列表
        parentName: string; // 套餐子项名
        name: string;
        soldOut: boolean; // 是否售罄
    }[];
    soldOutSummary: boolean; // 整行是否有售罄
}

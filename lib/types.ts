export interface Product {
  id: string
  name: string
  sku: string
  size: string
  pfand: number
  b2cPricing: PricingTier[]
  b2bBasePrice: number
  origin: string
  description: string
}

export interface PricingTier {
  quantity: number
  price: number
  pricePerCan: number
}

export interface Customer {
  id: string
  name: string
  type: 'Kiosk' | 'Supermarkt' | 'Café' | 'Großhandel'
  contact: { person: string; email: string; phone: string }
  address: { street: string; city: string; postalCode: string }
  pricing: number
  lastOrder: string
  totalOrders: number
  totalRevenue: number
  frequency: 'Wöchentlich' | '2x Monat' | 'Monatlich' | 'Unregelmäßig'
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customerName: string
  type: 'B2B' | 'B2C'
  status: 'Neu' | 'In Bearbeitung' | 'Versendet' | 'Geliefert' | 'Storniert'
  quantity: number
  pricePerCan: number
  subtotal: number
  pfandTotal: number
  total: number
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
}

export interface StockBatch {
  id: string
  batchNumber: string
  quantity: number
  location: string
  mhd: string
  receivedAt: string
  origin: string
  status: 'Aktiv' | 'Niedrig' | 'Kritisch'
}

export interface StockMovement {
  id: string
  type: 'Wareneingang' | 'Warenausgang' | 'Korrektur'
  quantity: number
  batchNumber: string
  reason: string
  createdAt: string
}

export interface RevenueData {
  month: string
  label: string
  b2b: number
  b2c: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  orderNumber: string
  customerId?: string
  customerName: string
  type: 'B2B' | 'B2C'
  subtotal: number
  pfandTotal: number
  total: number
  status: 'Entwurf' | 'Offen' | 'Bezahlt' | 'Überfällig' | 'Storniert'
  dueDate: string
  paidAt?: string
  createdAt: string
  paymentTerms: string
}

export interface DeliveryNote {
  id: string
  deliveryNumber: string
  orderId: string
  orderNumber: string
  customerName: string
  address: string
  quantity: number
  status: 'Erstellt' | 'In Zustellung' | 'Zugestellt'
  carrier?: string
  trackingNumber?: string
  createdAt: string
  deliveredAt?: string
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  quantity: number
  pricePerUnit: number
  shippingCost: number
  customsCost: number
  totalCost: number
  status: 'Entwurf' | 'Bestellt' | 'Verschifft' | 'Im Zoll' | 'Geliefert'
  orderDate: string
  estimatedArrival: string
  actualArrival?: string
  containerNumber?: string
  notes?: string
}

export interface Return {
  id: string
  returnNumber: string
  orderId?: string
  orderNumber?: string
  customerName: string
  reason: 'Beschädigt' | 'MHD abgelaufen' | 'Fehllieferung' | 'Kundenwunsch' | 'Sonstiges'
  quantity: number
  resolution: 'Gutschrift' | 'Ersatzlieferung' | 'Offen'
  status: 'Offen' | 'In Bearbeitung' | 'Abgeschlossen'
  amount: number
  createdAt: string
  resolvedAt?: string
  notes?: string
}

export interface InventoryCount {
  id: string
  batchNumber: string
  location: string
  systemQuantity: number
  countedQuantity: number
  difference: number
  status: 'Geplant' | 'Gezählt' | 'Korrigiert'
  countedAt?: string
  countedBy?: string
  notes?: string
}

export interface PfandTransaction {
  id: string
  customerId?: string
  customerName: string
  type: 'Ausgabe' | 'Rücknahme'
  quantity: number
  amount: number
  orderId?: string
  orderNumber?: string
  createdAt: string
}

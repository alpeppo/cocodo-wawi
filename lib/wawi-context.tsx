'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Order, Customer, Product, StockBatch, StockMovement, RevenueData, Invoice, DeliveryNote, PurchaseOrder, Return, InventoryCount, PfandTransaction } from './types'
import {
  orders as initialOrders,
  customers as initialCustomers,
  product as initialProduct,
  stockBatches as initialBatches,
  stockMovements as initialMovements,
  revenueData as initialRevenue,
  stockCapacity as STOCK_CAPACITY,
  invoices as initialInvoices,
  deliveryNotes as initialDeliveryNotes,
  purchaseOrders as initialPurchaseOrders,
  returns as initialReturns,
  inventoryCounts as initialInventoryCounts,
  pfandTransactions as initialPfandTransactions,
} from './mock-data'

interface WawiContextType {
  orders: Order[]
  customers: Customer[]
  products: Product[]
  stockBatches: StockBatch[]
  stockMovements: StockMovement[]
  revenueData: RevenueData[]
  stockCapacity: number
  invoices: Invoice[]
  deliveryNotes: DeliveryNote[]
  purchaseOrders: PurchaseOrder[]
  returns: Return[]
  inventoryCounts: InventoryCount[]
  pfandTransactions: PfandTransaction[]
  addOrder: (order: Omit<Order, 'id'>) => void
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  addStockEntry: (batch: Omit<StockBatch, 'id'>, movement: Omit<StockMovement, 'id'>) => void
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void
  addDeliveryNote: (note: Omit<DeliveryNote, 'id'>) => void
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void
  addReturn: (ret: Omit<Return, 'id'>) => void
  addInventoryCount: (count: Omit<InventoryCount, 'id'>) => void
  addPfandTransaction: (tx: Omit<PfandTransaction, 'id'>) => void
}

const WawiContext = createContext<WawiContextType | null>(null)

export function WawiProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [products, setProducts] = useState<Product[]>([initialProduct])
  const [stockBatches, setStockBatches] = useState<StockBatch[]>(initialBatches)
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialMovements)
  const [revenueData] = useState<RevenueData[]>(initialRevenue)
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(initialDeliveryNotes)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [returns, setReturns] = useState<Return[]>(initialReturns)
  const [inventoryCounts, setInventoryCounts] = useState<InventoryCount[]>(initialInventoryCounts)
  const [pfandTransactions, setPfandTransactions] = useState<PfandTransaction[]>(initialPfandTransactions)

  const addOrder = (order: Omit<Order, 'id'>) => {
    setOrders(prev => [{ ...order, id: `o${Date.now()}` }, ...prev])
  }
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: `c${Date.now()}` }])
  }
  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `prod-${Date.now()}` }])
  }
  const addStockEntry = (batch: Omit<StockBatch, 'id'>, movement: Omit<StockMovement, 'id'>) => {
    setStockBatches(prev => [...prev, { ...batch, id: `b${Date.now()}` }])
    setStockMovements(prev => [{ ...movement, id: `m${Date.now()}` }, ...prev])
  }
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices(prev => [{ ...invoice, id: `inv${Date.now()}` }, ...prev])
  }
  const addDeliveryNote = (note: Omit<DeliveryNote, 'id'>) => {
    setDeliveryNotes(prev => [{ ...note, id: `dn${Date.now()}` }, ...prev])
  }
  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id'>) => {
    setPurchaseOrders(prev => [{ ...po, id: `po${Date.now()}` }, ...prev])
  }
  const addReturn = (ret: Omit<Return, 'id'>) => {
    setReturns(prev => [{ ...ret, id: `ret${Date.now()}` }, ...prev])
  }
  const addInventoryCount = (count: Omit<InventoryCount, 'id'>) => {
    setInventoryCounts(prev => [{ ...count, id: `ic${Date.now()}` }, ...prev])
  }
  const addPfandTransaction = (tx: Omit<PfandTransaction, 'id'>) => {
    setPfandTransactions(prev => [{ ...tx, id: `pf${Date.now()}` }, ...prev])
  }

  return (
    <WawiContext.Provider value={{
      orders, customers, products, stockBatches, stockMovements, revenueData,
      stockCapacity: STOCK_CAPACITY,
      invoices, deliveryNotes, purchaseOrders, returns, inventoryCounts, pfandTransactions,
      addOrder, addCustomer, addProduct, addStockEntry,
      addInvoice, addDeliveryNote, addPurchaseOrder, addReturn, addInventoryCount, addPfandTransaction,
    }}>
      {children}
    </WawiContext.Provider>
  )
}

export function useWawi() {
  const ctx = useContext(WawiContext)
  if (!ctx) throw new Error('useWawi must be used within WawiProvider')
  return ctx
}

# BH Kitchen --- Complete Full-Stack Development Plan

## 1. Project vision

BH Kitchen is a mobile-first kitchenware e-commerce platform for
customers in Addis Ababa, Ethiopia. It will provide a customer
storefront, product catalogue, cart and checkout, order tracking,
inventory management, local payment workflows, delivery management, and
an admin dashboard for Bereket and Henok.

**Architecture recommendation:** Start with a modular monolith rather
than microservices. It is simpler to build, deploy, debug, and maintain,
while keeping clear module boundaries for future growth.

## 2. Recommended technology stack

  -----------------------------------------------------------------------
  Layer                   Recommended technology  Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js + React +       Storefront, product
                          TypeScript              pages, cart, checkout,
                                                  SEO

  Styling                 Tailwind CSS            Responsive styling

  UI components           shadcn/ui               Reusable interface
                                                  components

  Backend                 NestJS + TypeScript     REST API and business
                                                  logic

  API documentation       Swagger / OpenAPI       API documentation and
                                                  testing

  Database                PostgreSQL              Products, users,
                                                  inventory, orders,
                                                  payments

  ORM                     Prisma                  Database access and
                                                  migrations

  Validation              Zod and/or              Input validation
                          class-validator         

  Authentication          Secure server-side      Customer and admin
                          sessions or Auth.js     authentication

  Cache / jobs            Redis + BullMQ          Optional caching and
                                                  background jobs

  Image storage           S3-compatible object    Product images and
                          storage                 media

  Testing                 Vitest, Supertest,      Unit, API integration,
                          Playwright              and end-to-end tests

  Deployment              Docker + managed        Repeatable deployment
                          hosting                 

  CI/CD                   GitHub Actions          Automated checks and
                                                  deployment

  Monitoring              Sentry and uptime       Error and availability
                          monitoring              monitoring
  -----------------------------------------------------------------------

TypeScript across the frontend and backend reduces context switching and
makes it easier to share types and validation logic. PostgreSQL is a
strong fit for transactional e-commerce data. Start with one backend
application divided into modules.

## 3. System architecture

The platform has three primary parts:

1.  **Customer storefront:** customers browse products, add items to a
    cart, check out, and track orders.
2.  **Admin dashboard:** Bereket and Henok manage products, inventory,
    orders, payments, deliveries, and reports.
3.  **Backend API:** validates requests and applies business rules,
    permissions, and database transactions.

``` text
Customer Storefront (Next.js)
            |
            | HTTPS / REST API
            v
      Backend API (NestJS)
            |
     +------+-------+----------------+
     |              |                |
     v              v                v
 PostgreSQL    Object Storage   Payment Providers
     |          Product Images   Telebirr / CBE /
     |                           Manual Verification
     |
     +---------- Redis / BullMQ (optional)

      Admin Dashboard (Next.js)
            |
            +------ Backend API
```

The storefront and admin dashboard use the same backend API. The browser
must never directly update inventory or mark payments as successful.

## 4. Frontend application

Keep the existing BH Kitchen frontend as the starting point. Inspect its
framework, routing, components, and styling before deciding whether to
refactor it.

### Customer-facing pages

  Page              Main functionality
  ----------------- ---------------------------------------------------
  Home              Brand introduction, promotions, featured products
  Shop              Product listing, filtering, and sorting
  Product details   Images, price, description, stock availability
  Categories        Kitchenware categories
  Search            Search products by name and category
  Cart              Selected items, quantities, and totals
  Checkout          Contact details, delivery address, payment method
  Order success     Order number and confirmation
  Track order       Current order and delivery status
  About             BH Kitchen brand story
  Contact           Phone, WhatsApp, and social channels
  FAQ               Delivery, payment, returns, and common questions

### Admin dashboard pages

  Page              Main functionality
  ----------------- ---------------------------------------------------------
  Dashboard         Sales, orders, revenue, and alerts
  Products          Create, edit, archive, and feature products
  Categories        Manage product categories
  Inventory         Stock balances, adjustments, and low-stock alerts
  Stock purchases   Record incoming stock and supplier details
  Orders            Confirm, prepare, dispatch, cancel, and complete orders
  Payments          Review and verify payment records
  Delivery          Assign riders and update delivery status
  Customers         Customer details and order history
  Reports           Sales, margins, inventory, and product performance
  Settings          Store details, delivery rules, and operational settings
  Audit log         Review important administrative actions

Admin pages must be protected by server-side authorization. Hiding admin
links in the frontend is not security.

## 5. Backend modules

Organize the NestJS application into business modules:

  Module          Responsibilities
  --------------- -----------------------------------------------
  Auth            Login, sessions, roles, permissions
  Users           Customer and staff profiles
  Addresses       Customer delivery addresses
  Products        Product information, SKUs, and images
  Categories      Kitchenware categories
  Inventory       Stock balances and stock movements
  Carts           Cart creation and item management
  Orders          Order creation and status transitions
  Payments        Payment initiation, records, and verification
  Delivery        Rider assignment and delivery tracking
  Promotions      Discounts and promotional codes
  Notifications   Order and customer notifications
  Reports         Sales and inventory analytics
  Audit           Records of sensitive administrative actions

Keep modules in one deployable backend initially. Maintain clear
boundaries so modules can be extracted later if necessary.

## 6. Database design

Use PostgreSQL as the source of truth.

### Main tables

  -----------------------------------------------------------------------
  Table                               Important fields
  ----------------------------------- -----------------------------------
  users                               id, name, phone, email,
                                      password_hash, role

  addresses                           id, user_id, city, subcity, woreda,
                                      area, landmark, notes

  categories                          id, name, slug, image

  products                            id, name, slug, description,
                                      category_id, active

  product_images                      id, product_id, image_url, position

  product_variants                    id, product_id, sku, price,
                                      cost_price

  inventory                           id, variant_id, quantity_available,
                                      reorder_level

  stock_movements                     id, variant_id, quantity_change,
                                      reason, actor_id

  carts                               id, user_id, session_id

  cart_items                          id, cart_id, variant_id, quantity

  orders                              id, order_number, customer_id,
                                      status, subtotal, delivery_fee,
                                      discount, total

  order_items                         id, order_id, product_name, sku,
                                      quantity, unit_price, unit_cost

  payments                            id, order_id, method, reference,
                                      status, amount, verified_by

  deliveries                          id, order_id, rider_name, phone,
                                      status, fee

  promotions                          id, code, discount_type,
                                      discount_value

  audit_logs                          id, actor_id, action, entity_type,
                                      entity_id, created_at
  -----------------------------------------------------------------------

### Relationship model

``` text
User
 ├── Addresses
 ├── Cart
 └── Orders
      ├── OrderItems
      ├── Payments
      └── Delivery

Category
 └── Products
      └── ProductVariants
           ├── Inventory
           └── StockMovements
```

A product can start with one variant. Keep the variant structure so
different sizes, colors, or bundles can be supported later.

### Database rules

-   Store ETB money values as integer minor units or use a carefully
    defined fixed-precision decimal type. Never use floating-point
    values for money.
-   Store snapshots of product name, SKU, selling price, and relevant
    cost in each order item. Historical orders must not change when a
    product is edited.
-   Record inventory changes in a stock movement ledger rather than
    silently editing quantities.
-   Store payment references and verification details.
-   Use database transactions when creating orders and reserving stock.
-   Add unique constraints for SKUs, order numbers, and payment
    references where appropriate.
-   Use foreign keys and indexes for frequently queried relationships.
-   Archive products rather than deleting records needed by historical
    orders.

## 7. Order lifecycle

A typical order follows this process:

1.  Customer selects products, quantities, and delivery address.
2.  Backend validates current prices and stock availability.
3.  Backend calculates totals and creates the order.
4.  Order enters pending-payment state, unless cash on delivery is
    selected.
5.  Customer pays or submits a payment reference.
6.  Payment is verified through a trusted provider response or an
    authorized manual check.
7.  Order is confirmed and prepared.
8.  Items are packed.
9.  Rider is assigned and order is dispatched.
10. Delivery is confirmed and order is completed.

Suggested order statuses:

``` text
PENDING
CONFIRMED
PROCESSING
READY
DISPATCHED
DELIVERED
CANCELLED
```

Suggested payment statuses:

``` text
UNPAID
PENDING_VERIFICATION
PAID
FAILED
REFUNDED
```

Keep order status separate from payment status.

### Inventory reservation

-   Reserve stock within a database transaction when an order is
    created.
-   Give unpaid reservations a configurable expiry period.
-   Release reserved stock when an order expires or is cancelled.
-   Commit the stock movement according to the documented confirmation
    policy.
-   Prevent two concurrent checkouts from reserving the same last unit.

## 8. Ethiopian payment integration

Potential payment methods:

  -----------------------------------------------------------------------
  Method                              Initial approach
  ----------------------------------- -----------------------------------
  Telebirr                            Merchant integration if approved
                                      API access is available

  CBE / CBE Birr                      Supported merchant or transfer
                                      workflow, depending on access

  Bank transfer                       Reference-based manual verification

  Cash on delivery                    Optional, subject to business
                                      policy and delivery risk
  -----------------------------------------------------------------------

Use a payment-provider abstraction instead of embedding
provider-specific logic directly into checkout:

``` ts
interface PaymentProvider {
  initiatePayment(input: {
    orderId: string;
    amount: number;
    phone: string;
  }): Promise<PaymentResult>;

  verifyPayment(reference: string): Promise<PaymentResult>;
}
```

Possible implementations:

``` text
PaymentProvider
 ├── TelebirrProvider
 ├── CBEProvider
 └── ManualTransferProvider
```

Actual integrations depend on merchant onboarding, current provider
documentation, API access, and commercial requirements. Confirm these
details directly with the providers before promising automatic payment
confirmation.

### Manual transfer workflow

1.  Customer places an order.
2.  Website displays official business payment instructions.
3.  Customer submits a transaction reference.
4.  Admin checks the actual merchant or bank transaction record.
5.  Admin marks the payment verified.
6.  Backend records who verified it and when.

Do not mark payments as successful based only on an uploaded screenshot.
Do not collect customer bank passwords, PINs, or OTPs.

### Payment security

-   Verify provider callbacks or status responses on the backend.
-   Validate callback signatures according to provider documentation.
-   Make callbacks idempotent so duplicate notifications do not create
    duplicate transactions.
-   Store provider transaction references.
-   Keep an audit trail of manual verification and refunds.
-   Never trust a payment status submitted by the browser.

## 9. Inventory and pricing

For the initial home-based operation, one inventory location such as
`BH-HOME-STOCK` is sufficient.

Each product or variant should have a name, description, unique SKU,
category, images, buying cost, selling price, available quantity,
reorder threshold, active status, and featured-product flag.

Example planning record:

  Field               Example
  ------------------- ---------------------------
  Product             Mini Rechargeable Chopper
  SKU                 BH-CHP-001
  Category            Kitchen Gadgets
  Buying cost         650 ETB
  Selling price       950 ETB
  Stock               12
  Reorder threshold   4

These are illustrative values, not verified supplier prices.

### Inventory features

-   Record incoming stock purchases.
-   Increase or decrease stock with a reason.
-   View current stock and stock movement history.
-   Display low-stock alerts.
-   Track fast-moving and slow-moving products.
-   Calculate product-level gross profit.
-   Record supplier information and purchase references.

### Pricing calculations

``` text
Order Total =
  Items Subtotal
  + Delivery Fee
  - Discount

Gross Profit =
  Selling Price
  - Product Cost
```

Track delivery, packaging, payment, and marketing expenses separately to
understand actual profitability.

## 10. Delivery management for Addis Ababa

Start with delivery management inside the admin dashboard. A dedicated
rider application is not necessary for the first release.

Capture customer phone number, subcity, woreda if known, neighborhood or
area, building name or number, nearby landmark, delivery instructions,
optional map pin or location link, delivery fee, rider name and phone,
and dispatch/delivery timestamps.

Suggested delivery statuses:

``` text
UNASSIGNED
ASSIGNED
PICKED_UP
IN_TRANSIT
DELIVERED
FAILED
RETURNED
```

Do not require a conventional street address if customers can provide a
useful landmark and phone number. Make apartment and building delivery
instructions easy to enter.

## 11. REST API design

Use versioned REST endpoints under `/api/v1`.

### Customer APIs

  Method   Endpoint                        Purpose
  -------- ------------------------------- --------------------
  GET      `/api/v1/products`              List products
  GET      `/api/v1/products/:slug`        Product details
  GET      `/api/v1/categories`            List categories
  GET      `/api/v1/search`                Search products
  POST     `/api/v1/cart/items`            Add cart item
  PATCH    `/api/v1/cart/items/:id`        Update quantity
  DELETE   `/api/v1/cart/items/:id`        Remove cart item
  POST     `/api/v1/orders`                Create order
  GET      `/api/v1/orders/:orderNumber`   Track order
  POST     `/api/v1/payments/initiate`     Start payment
  GET      `/api/v1/payments/:id`          Get payment status

### Admin APIs

  Method   Endpoint                                Purpose
  -------- --------------------------------------- -----------------------
  POST     `/api/v1/admin/products`                Create product
  PATCH    `/api/v1/admin/products/:id`            Update product
  DELETE   `/api/v1/admin/products/:id`            Archive product
  GET      `/api/v1/admin/orders`                  List orders
  PATCH    `/api/v1/admin/orders/:id/status`       Update order status
  POST     `/api/v1/admin/inventory/adjustments`   Adjust inventory
  POST     `/api/v1/admin/stock-purchases`         Record stock purchase
  POST     `/api/v1/admin/payments/:id/verify`     Verify payment
  POST     `/api/v1/admin/deliveries/:id/assign`   Assign delivery
  GET      `/api/v1/admin/reports/sales`           Sales report

All admin routes must enforce authorization on the server. Use
pagination, filtering, consistent error responses, and request
validation.

## 12. Repository and folder structure

A monorepo is a good fit because the frontend and backend can share
TypeScript types and validation schemas.

``` text
bh-kitchen/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (store)/
│   │       │   ├── admin/
│   │       │   ├── checkout/
│   │       │   ├── products/
│   │       │   └── orders/
│   │       ├── components/
│   │       ├── features/
│   │       ├── hooks/
│   │       ├── lib/
│   │       └── types/
│   └── api/
│       └── src/
│           ├── auth/
│           ├── users/
│           ├── products/
│           ├── categories/
│           ├── inventory/
│           ├── cart/
│           ├── orders/
│           ├── payments/
│           ├── delivery/
│           ├── notifications/
│           ├── reports/
│           └── main.ts
├── packages/
│   ├── shared-types/
│   ├── validation/
│   └── config/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── infrastructure/
│   ├── docker/
│   └── deployment/
├── docker-compose.yml
├── package.json
└── README.md
```

Use pnpm workspaces and optionally Turborepo to manage the monorepo.

## 13. Authentication, roles, and security

### Roles

  Role             Permissions
  ---------------- -------------------------------------------------------
  Owner            Full system access
  Admin            Products, orders, inventory, payments, and operations
  Staff            Assigned operational tasks
  Delivery rider   Assigned delivery information only
  Customer         Own profile and orders

Bereket and Henok should have separate owner accounts rather than
sharing one administrator password.

### Security requirements

-   Use secure, HTTP-only cookies for browser sessions.
-   Hash passwords with Argon2id.
-   Enforce role-based access control on the backend.
-   Validate every request server-side.
-   Rate-limit login, registration, and checkout endpoints.
-   Protect against CSRF where cookie-based authentication requires it.
-   Use HTTPS everywhere.
-   Keep secrets in environment variables or a secrets manager.
-   Never commit production credentials.
-   Log sensitive administrative actions.
-   Back up the database automatically.
-   Restrict uploaded image file types and sizes.
-   Avoid storing payment credentials or card details.
-   Provide a privacy notice explaining how customer data is used and
    retained.

## 14. Hosting and deployment

  Component    Suggested option
  ------------ ---------------------------------------------------
  Frontend     Vercel or a Docker-based web host
  Backend      Docker container on a managed cloud VPS
  Database     Managed PostgreSQL or secured PostgreSQL on a VPS
  Images       S3-compatible object storage
  DNS          Cloudflare
  Domain       Suitable `.com` or `.et` domain
  CI/CD        GitHub Actions
  Monitoring   Sentry and uptime monitoring
  Backups      Automated database backups

A reasonable starting arrangement is Next.js on Vercel, NestJS in Docker
on a VPS, managed PostgreSQL, and object storage for product images.

Before choosing providers, check whether they accept your available
payment methods, whether their services can be paid for from Ethiopia,
whether the region provides acceptable response times, whether database
export is supported, and whether the service terms allow the intended
commercial use.

### Environments

1.  **Development:** local development.
2.  **Staging:** testing new features and releases.
3.  **Production:** the live BH Kitchen store.

Do not experiment directly on production inventory or orders.

## 15. Development roadmap

A six-week implementation plan is recommended. A smaller MVP can be
released earlier if the existing frontend is already complete.

### Week 1 --- Project foundation

-   Inspect and integrate the existing frontend.
-   Set up Next.js, NestJS, and PostgreSQL.
-   Configure Prisma and migrations.
-   Create authentication and admin roles.
-   Build the initial database schema.

**Deliverable:** Running application foundation.

### Week 2 --- Products and inventory

-   Product and category management.
-   Product image uploads.
-   Admin product management.
-   Inventory adjustments and stock movements.
-   Public product catalogue and search.

**Deliverable:** Working online product catalogue.

### Week 3 --- Cart and checkout

-   Shopping cart.
-   Customer details and addresses.
-   Checkout validation.
-   Order creation.
-   Order confirmation page.
-   Inventory reservation and release rules.

**Deliverable:** Customers can place orders.

### Week 4 --- Payments and delivery

-   Payment-provider abstraction.
-   Telebirr and CBE integration if merchant access is available.
-   Manual transfer verification workflow.
-   Delivery assignment.
-   Order status tracking.

**Deliverable:** End-to-end order processing.

### Week 5 --- Admin and business operations

-   Dashboard metrics.
-   Customer management.
-   Sales and inventory reports.
-   Notifications.
-   Audit logging.
-   Mobile responsiveness and accessibility.

**Deliverable:** Operational business dashboard.

### Week 6 --- Testing and launch

-   End-to-end testing.
-   Payment and order testing.
-   Security checks.
-   Production deployment.
-   Domain and SSL setup.
-   Add real products and product photos.
-   Soft launch with a small group of customers.

**Deliverable:** First production release.

## 16. Testing strategy

  -----------------------------------------------------------------------
  Test type               What to test            Recommended tool
  ----------------------- ----------------------- -----------------------
  Unit                    Pricing, discounts,     Vitest
                          stock calculations      

  API integration         Products, checkout,     Supertest
                          payments                

  UI components           Forms, cart, product    React Testing Library
                          cards                   

  End-to-end              Complete purchase       Playwright
                          process                 

  Security                Authentication and      Automated tests and
                          authorization           manual review

  Performance             Mobile loading and      Lighthouse
                          responsiveness          
  -----------------------------------------------------------------------

### Critical scenarios

1.  A customer cannot order more stock than is available.
2.  Two customers cannot purchase the same last item concurrently.
3.  A cancelled or expired order releases reserved stock.
4.  A failed payment cannot become a paid order.
5.  Duplicate payment callbacks do not create duplicate transactions.
6.  Historical order information remains intact if a product is edited.
7.  A customer cannot view another customer's private order details.
8.  A rider cannot access admin payment information.
9.  Order totals are calculated by the backend, not trusted from the
    browser.
10. Guest checkout works if enabled.

## 17. MVP versus future features

  -----------------------------------------------------------------------
  Feature                 First release           Later
  ----------------------- ----------------------- -----------------------
  Product catalogue       Required                ---

  Search and categories   Required                Advanced filters

  Shopping cart           Required                Saved carts

  Guest checkout          Recommended             Customer loyalty

  Order management        Required                Automated workflows

  Inventory               Required                Supplier purchasing

  Telebirr / CBE          Priority, subject to    Additional providers
                          access                  

  Delivery management     Required                Dedicated rider app

  Sales reports           Basic                   Advanced analytics

  Customer reviews        Later                   Verified reviews

  Coupons                 Later                   Loyalty program

  Wishlist                Later                   Personalized
                                                  recommendations

  Multi-vendor            Not needed              Only if the business
  marketplace                                     model changes
  -----------------------------------------------------------------------

The first release should focus on reliably selling the initial 12--15
kitchenware products.

## 18. Features to avoid initially

These add complexity without being essential to the first launch:

-   Microservices.
-   Kubernetes.
-   AI-powered product recommendations.
-   Complex loyalty systems.
-   Multiple warehouse management.
-   Automated route optimization.
-   Separate Android and iOS apps.
-   Multi-vendor seller accounts.
-   Cryptocurrency payments.

A responsive website is enough for the initial release. A Progressive
Web App (PWA) can be considered later.

## 19. Admin dashboard business metrics

Track:

-   Daily, weekly, and monthly sales.
-   Number of orders.
-   Average order value.
-   Gross profit.
-   Delivery expenses.
-   Best-selling products.
-   Products with low inventory.
-   Cancelled orders.
-   Unpaid orders.
-   Payment verification time.
-   Repeat customers.

Example dashboard metrics (illustrative only):

  Metric                   Example
  -------------------- -----------
  Today's sales          8,500 ETB
  New orders                    12
  Pending orders                 4
  Low-stock products             3

These are sample dashboard data, not actual BH Kitchen business results.

## 20. Final recommended architecture

### Customer experience

-   Next.js + React + TypeScript.
-   Tailwind CSS + shadcn/ui.
-   Responsive storefront and checkout.

### Backend

-   NestJS + TypeScript.
-   REST API + Swagger/OpenAPI.
-   Modular monolith.
-   Zod and/or class-validator.

### Data

-   PostgreSQL.
-   Prisma ORM.
-   Redis + BullMQ when background jobs are needed.
-   S3-compatible image storage.

### Payments and operations

-   Telebirr provider adapter.
-   CBE provider adapter.
-   Manual payment verification.
-   Delivery management module.

### Infrastructure

-   Docker.
-   GitHub Actions.
-   Cloudflare DNS.
-   Managed hosting.
-   Automated backups and monitoring.

## 21. Recommended implementation order

Since the BH Kitchen frontend already exists, do not discard or rebuild
it without first inspecting the codebase.

1.  Review the existing frontend and identify what is already
    implemented.
2.  Confirm the frontend framework and project structure.
3.  Define backend API contracts.
4.  Design the PostgreSQL database.
5.  Build authentication and admin access.
6.  Connect existing product pages to database-backed product data.
7.  Implement cart and checkout.
8.  Implement orders, inventory, and payment verification.
9.  Build the admin dashboard.
10. Test and deploy.

## 22. Decisions to confirm before implementation

  Decision       Recommended starting point
  -------------- ----------------------------------------------------
  Frontend       Next.js + TypeScript
  Backend        NestJS + TypeScript
  Database       PostgreSQL
  Architecture   Modular monolith
  Repository     pnpm monorepo
  API            REST + OpenAPI
  Payment        Provider adapters plus manual verification
  Checkout       Guest checkout supported
  Inventory      One home-stock location
  Delivery       Admin-managed rider assignment
  Deployment     Managed frontend, Docker backend, managed database

## Final recommendation

Build BH Kitchen as a real business operations system, not just an
attractive online catalogue.

The most important foundations are:

1.  Reliable product and stock management.
2.  Correct order processing and pricing.
3.  Secure payment verification.
4.  Practical Addis Ababa delivery workflows.
5.  A simple admin dashboard that both founders can operate.

Start with a modular monolith, a focused MVP, and the existing frontend.
Add complexity only when actual customer demand and business operations
justify it.

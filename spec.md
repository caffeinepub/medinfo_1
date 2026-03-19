# MedInfo

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Medicine database with detailed drug information (name, uses, dosage, side effects, warnings, category)
- QR code / barcode scanner to identify tablets and retrieve their information
- Search functionality to find medicines by name or category
- Medicine detail pages with full drug information
- Admin-only ability to add, edit, and delete medicine entries
- Homepage with hero section, featured medicines, and how-it-works section
- Authentication (admin login) for managing medicine data

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Medicine data model with CRUD operations, search by name/code, role-based access for admin
2. Frontend: Homepage with search bar, QR scanner page, medicine detail page, admin dashboard for medicine management
3. Components: authorization for admin access, qr-code for tablet scanning

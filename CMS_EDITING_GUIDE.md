# CMS Editing Guide

Complete guide for editing industry pages, service pages, and other content in the Resnovate CMS.

## Quick Start

### 1. Run the Industry Pages Seed Script

First, populate your database with default content for all 7 industry pages:

```bash
cd backend
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
python seed_industry_pages.py
```

This will create content for:
- Healthcare & Life Sciences
- Financial Services
- Manufacturing
- Retail & E-commerce
- Technology & Software
- Energy & Utilities
- Government & Public Sector

### 2. Access Django Admin

**Local Development:**
```
http://localhost:8000/admin/
```

**Production:**
```
https://your-domain.com/admin/
```

Login with your superuser credentials.

## Editing Industry Pages

### Understanding Industry Page Structure

Each industry page uses this page identifier format: `industries-{slug}`

**Available Industry Slugs:**
- `industries-healthcare`
- `industries-financial`
- `industries-manufacturing`
- `industries-retail`
- `industries-technology`
- `industries-energy`
- `industries-government`

### Section Keys for Industry Pages

Each industry page has 5 customizable sections:

#### 1. Hero Section (`section_key: "hero"`)

**Location:** Top of the page
**Content Structure:**
```json
{
  "title": "Healthcare & Life Sciences",
  "subtitle": "Transforming patient care through innovation",
  "description": "Detailed description of your industry expertise..."
}
```

**How to Edit:**
1. Go to **Content → Page Sections**
2. Search for: `industries-healthcare` (or your industry)
3. Find section with key: `hero`
4. Edit the JSON content
5. Save

#### 2. Overview Section (`section_key: "overview"`)

**Content Structure:**
```json
{
  "title": "Industry Overview",
  "description": "Comprehensive description...",
  "benefits": [
    "Increased operational efficiency",
    "Enhanced customer experience",
    "Data-driven decision making",
    "Compliance and security"
  ]
}
```

#### 3. Challenges Section (`section_key: "challenges"`)

**Content Structure:**
```json
{
  "title": "Common Challenges",
  "challenges": [
    {
      "title": "Digital Transformation",
      "description": "Adapting to rapidly changing technology landscape"
    },
    {
      "title": "Regulatory Compliance",
      "description": "Meeting industry-specific regulations"
    },
    {
      "title": "Customer Expectations",
      "description": "Delivering seamless, personalized experiences"
    }
  ]
}
```

#### 4. Solutions Section (`section_key: "solutions"`)

**Content Structure:**
```json
{
  "title": "Our Solutions",
  "solutions": [
    {
      "title": "Consulting Services",
      "description": "Strategic guidance for digital transformation"
    },
    {
      "title": "Technology Implementation",
      "description": "End-to-end solution delivery"
    },
    {
      "title": "Managed Services",
      "description": "Ongoing support and optimization"
    },
    {
      "title": "Training & Support",
      "description": "Empowering your team for success"
    }
  ]
}
```

#### 5. CTA Section (`section_key: "cta"`)

**Content Structure:**
```json
{
  "title": "Ready to Transform Your Business?",
  "description": "Let's discuss how we can help you achieve your goals"
}
```

### Step-by-Step: Editing Healthcare Industry Page

1. **Login to Django Admin** (`/admin/`)

2. **Navigate to Page Sections**
   - Click **Content** in the sidebar
   - Click **Page Sections**

3. **Filter for Healthcare**
   - In the search box, type: `industries-healthcare`
   - You'll see 5 sections (hero, overview, challenges, solutions, cta)

4. **Edit a Section**
   - Click on the section you want to edit
   - Modify the **Content** JSON field
   - Click **Save**

5. **View Changes**
   - Go to: `http://localhost:3000/industries/healthcare`
   - Refresh to see your changes

## Editing Service Pages

Service pages are different - they use the **Services** model directly, not Page Sections.

### Creating/Editing a Service

1. **Navigate to Services**
   - Go to **Content → Services**

2. **Create New Service**
   - Click **Add Service** button
   - Fill in the form:

**Required Fields:**
```
Name: AI Strategy & Implementation
Slug: ai-strategy-implementation (URL-friendly)
Description: Full description of the service...
Status: Active
```

**Optional Fields:**
```
Short Description: Brief summary (150 chars)
Category: Consulting / Technology / Training
Base Price: 50000.00
Estimated Duration: 12-16 weeks
Featured: ✓ (check to feature on homepage)
Icon: 🤖 (emoji or icon class)
```

**Features Array:**
```json
[
  "AI readiness assessment",
  "Strategic roadmap development",
  "Technology stack selection",
  "ROI optimization planning"
]
```

3. **Save and View**
   - Click **Save**
   - View at: `/services/{your-slug}`

### Service URLs

Services are automatically accessible at:
```
/services/{slug}
```

Examples:
- `/services/ai-strategy-implementation`
- `/services/machine-learning-solutions`
- `/services/process-automation`

## Advanced: Custom JSON Fields

### Benefits Array
```json
{
  "benefits": [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3"
  ]
}
```

### Complex Objects
```json
{
  "items": [
    {
      "title": "Item Title",
      "description": "Item description",
      "icon": "🎯",
      "link": "/path/to/page"
    }
  ]
}
```

### Nested Content
```json
{
  "section": {
    "title": "Section Title",
    "subsections": [
      {
        "heading": "Subsection 1",
        "content": "Content here..."
      }
    ]
  }
}
```

## Enabling/Disabling Sections

Each section has an **Enabled** checkbox:

- **Checked (✓):** Section appears on the page
- **Unchecked:** Section is hidden (but content is preserved)

**Use case:** Hide seasonal content without deleting it.

## Section Ordering

The **Order** field determines the display sequence:

```
order: 1 → Displays first
order: 2 → Displays second
order: 3 → Displays third
```

To reorder sections, just change the order numbers and save.

## Common Editing Tasks

### Task 1: Update Healthcare Hero Title

```bash
1. Admin → Content → Page Sections
2. Search: "industries-healthcare"
3. Click section with key: "hero"
4. Edit content JSON:
   {
     "title": "Healthcare Innovation Starts Here",
     "subtitle": "AI-powered solutions for modern healthcare",
     "description": "..."
   }
5. Save
```

### Task 2: Add a New Challenge

```bash
1. Find challenges section for your industry
2. Edit content JSON, add to array:
   {
     "challenges": [
       // ... existing challenges
       {
         "title": "New Challenge Title",
         "description": "Description of the challenge"
       }
     ]
   }
3. Save
```

### Task 3: Create a New Service

```bash
1. Admin → Content → Services
2. Click "Add Service"
3. Fill in:
   - Name: "New Service Name"
   - Slug: "new-service-name"
   - Description: "Full description..."
   - Status: Active
   - Features: ["Feature 1", "Feature 2"]
4. Save
5. View at: /services/new-service-name
```

## Troubleshooting

### Changes Not Appearing?

1. **Clear browser cache:** Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. **Check section is enabled:** Verify the "Enabled" checkbox is checked
3. **Verify page identifier:** Ensure it matches the format: `industries-{slug}`
4. **Check JSON syntax:** Invalid JSON won't save - look for error messages

### JSON Validation Errors?

Common issues:
- Missing quotes around strings
- Missing commas between items
- Extra comma after last item
- Unescaped quotes in strings (use `\"` or single quotes)

**Valid:**
```json
{
  "title": "My Title",
  "items": ["Item 1", "Item 2"]
}
```

**Invalid:**
```json
{
  "title": "My Title"
  "items": ["Item 1", "Item 2",]  ← Extra comma
}
```

### Page Not Found?

- Verify the industry slug in the URL matches an available industry
- Check that the frontend is running (`npm run dev`)
- Ensure the industry is listed in `frontend/src/app/industries/[slug]/page.tsx`

## Production Deployment

After editing content in production:

1. Changes are **immediate** - no redeployment needed
2. Frontend fetches fresh data from the API
3. May need to clear CDN cache if using one

## Backup and Restore

### Export Page Sections

```bash
python manage.py dumpdata content.PageSection > page_sections_backup.json
```

### Import Page Sections

```bash
python manage.py loaddata page_sections_backup.json
```

## Tips and Best Practices

1. **Use Descriptive Section Names:** Makes finding sections easier
2. **Test Changes Locally First:** Before editing production
3. **Keep JSON Formatted:** Use a JSON formatter for complex content
4. **Version Control Seed Scripts:** Track changes to default content
5. **Document Custom Sections:** Add comments in seed scripts
6. **Use Staging Environment:** Test major changes before production

## Need Help?

- **JSON Syntax:** Use [JSONLint](https://jsonlint.com/) to validate
- **Django Admin Docs:** `/admin/doc/` (if enabled)
- **Frontend Components:** Check `frontend/src/app/industries/[slug]/page.tsx`

---

**Quick Reference:**

| What | Where | Format |
|------|-------|--------|
| Industry Pages | Content → Page Sections | `industries-{slug}` |
| Service Pages | Content → Services | Direct model fields |
| Enable/Disable | Checkbox in section | ✓ = shown |
| Ordering | Order field (number) | Lower = first |
| Content | JSON field | Valid JSON syntax |

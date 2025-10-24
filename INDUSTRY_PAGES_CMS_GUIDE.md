# Industry Pages CMS Editing Guide

This guide explains how to edit industry page content through the Django Admin CMS.

## Accessing the CMS

1. Navigate to: `http://localhost:8000/admin/`
2. Log in with your admin credentials
3. Click on **"Page Sections"** under the **CONTENT** section

## Industry Pages Overview

We have 7 industry pages, each fully editable through the CMS:

1. **Healthcare & Life Sciences** (`industries-healthcare`)
2. **Financial Services** (`industries-financial`)
3. **Manufacturing** (`industries-manufacturing`)
4. **Retail & E-commerce** (`industries-retail`)
5. **Technology & Software** (`industries-technology`)
6. **Energy & Utilities** (`industries-energy`)
7. **Government & Public Sector** (`industries-government`)

## Page Sections Explained

Each industry page consists of the following sections:

### 1. Hero Section (`hero`)
**Purpose:** The main banner at the top of the page

**Content Structure:**
```json
{
  "title": "Healthcare & Life Sciences",
  "subtitle": "Transforming patient care through innovation",
  "description": "Revolutionize healthcare delivery with AI-powered solutions..."
}
```

**Fields:**
- `title` - Main heading (appears large and bold)
- `subtitle` - Subheading below the title
- `description` - Additional description text (optional)

---

### 2. Overview Section (`overview`)
**Purpose:** Introduction to the industry and key benefits

**Content Structure:**
```json
{
  "title": "Industry Overview",
  "description": "Healthcare organizations face unprecedented challenges...",
  "benefits": [
    "Enhanced patient care and clinical outcomes",
    "Streamlined administrative workflows",
    "Advanced medical research",
    "Improved regulatory compliance",
    "Reduced operational costs"
  ]
}
```

**Fields:**
- `title` - Section heading
- `description` - Overview paragraph describing the industry context
- `benefits` - Array of benefit statements (displayed with checkmarks)

---

### 3. Challenges Section (`challenges`)
**Purpose:** Common challenges faced by the industry

**Content Structure:**
```json
{
  "title": "Healthcare Industry Challenges",
  "challenges": [
    {
      "title": "Data Management",
      "description": "Managing vast amounts of patient data..."
    },
    {
      "title": "Operational Efficiency",
      "description": "Reducing administrative burden..."
    }
  ]
}
```

**Fields:**
- `title` - Section heading
- `challenges` - Array of challenge cards
  - Each challenge has:
    - `title` - Challenge name
    - `description` - Explanation of the challenge

---

### 4. Solutions Section (`solutions`)
**Purpose:** Your solutions/services for the industry

**Content Structure:**
```json
{
  "title": "Healthcare Solutions",
  "description": "Comprehensive AI-powered solutions...",
  "solutions": [
    {
      "title": "Clinical Decision Support",
      "description": "AI-powered diagnostic assistance...",
      "icon": "lightbulb"
    }
  ]
}
```

**Fields:**
- `title` - Section heading
- `description` - Brief intro to your solutions
- `solutions` - Array of solution cards
  - Each solution has:
    - `title` - Solution name
    - `description` - What the solution does
    - `icon` - Icon identifier (see icon options below)

**Available Icons:**
- `chart` - Chart/Analytics icon
- `cog` - Settings/Automation icon
- `lightbulb` - Innovation/Ideas icon
- `users` - People/Team icon
- `shield` - Security/Protection icon
- `rocket` - Launch/Speed icon

---

### 5. Statistics Section (`stats`) - OPTIONAL
**Purpose:** Showcase measurable impact and results

**Content Structure:**
```json
{
  "subtitle": "Healthcare Impact",
  "title": "Proven Healthcare Results",
  "stats": [
    {
      "label": "Improved Diagnostic Accuracy",
      "value": "95%"
    },
    {
      "label": "Reduction in Admin Time",
      "value": "60%"
    }
  ]
}
```

**Fields:**
- `subtitle` - Small text above title
- `title` - Section heading
- `stats` - Array of statistics (displays in a grid)
  - Each stat has:
    - `label` - Description of the metric
    - `value` - The number/percentage (displayed large)

**Note:** This section only appears if it exists in the CMS.

---

### 6. Case Studies Section (`case_studies`) - OPTIONAL
**Purpose:** Real success stories and case studies

**Content Structure:**
```json
{
  "title": "Healthcare Success Stories",
  "description": "See how we've helped organizations...",
  "stories": [
    {
      "tag": "Patient Care",
      "title": "AI-Powered Diagnostics for Regional Hospital",
      "description": "Implemented advanced AI diagnostic tools...",
      "results": [
        "30% faster diagnosis time",
        "25% improvement in accuracy",
        "$1.2M annual cost savings"
      ],
      "link": "/case-studies/healthcare-ai"
    }
  ]
}
```

**Fields:**
- `title` - Section heading
- `description` - Intro text
- `stories` - Array of success story cards
  - Each story has:
    - `tag` - Category badge (e.g., "Patient Care")
    - `title` - Story headline
    - `description` - Brief summary
    - `results` - Array of key outcomes (with checkmarks)
    - `link` - URL to full case study (optional)

**Note:** This section only appears if it exists in the CMS.

---

### 7. CTA Section (`cta`)
**Purpose:** Call-to-action at the bottom of the page

**Content Structure:**
```json
{
  "title": "Transform Your Healthcare Operations",
  "description": "Discover how our AI solutions can improve patient care..."
}
```

**Fields:**
- `title` - Main CTA heading
- `description` - Supporting text

The buttons ("Get Started" and "Book Consultation") are hardcoded and link to `/contact` and `/book-consultation`.

---

## How to Edit Content

### Method 1: Through Django Admin UI

1. Go to **Admin → Content → Page Sections**
2. Filter by **Page identifier** (e.g., "Healthcare & Life Sciences")
3. Click on the section you want to edit
4. Edit the **Content** field (JSON format)
5. Click **Save**

### Method 2: Direct JSON Editing

The **Content** field contains JSON. Here's how to edit it safely:

1. Copy the existing JSON
2. Use a JSON validator (like jsonlint.com) to ensure proper formatting
3. Make your changes
4. Validate again
5. Paste back and save

### Common Editing Tips

✅ **DO:**
- Keep JSON properly formatted with quotes around strings
- Use arrays `[]` for lists
- Use objects `{}` for grouped data
- Test your changes on the frontend after saving

❌ **DON'T:**
- Remove commas between array items
- Forget closing brackets/braces
- Use single quotes (use double quotes `"` instead)
- Delete required fields

---

## Enabling/Disabling Sections

Each section has an **Enabled** checkbox. Uncheck it to hide a section without deleting the content.

You can also change the **Order** field to rearrange sections on the page.

---

## Adding New Content

### To Add a New Solution:

1. Find the `solutions` section for your industry
2. Add a new object to the `solutions` array:

```json
{
  "title": "New Solution Name",
  "description": "Description of what it does",
  "icon": "chart"
}
```

### To Add a New Challenge:

```json
{
  "title": "Challenge Name",
  "description": "Explanation of the challenge"
}
```

### To Add a New Benefit:

Just add a new string to the `benefits` array:

```json
"benefits": [
  "Existing benefit",
  "New benefit you're adding"
]
```

---

## Viewing Your Changes

After making changes in the CMS:

1. Save the Page Section
2. Navigate to the industry page on the frontend:
   - Healthcare: `http://localhost:3000/industries/healthcare`
   - Financial: `http://localhost:3000/industries/financial`
   - etc.
3. Refresh the page to see your updates

Changes are instant - no rebuild required!

---

## Troubleshooting

### Content Not Showing Up

1. Check that the section is **Enabled**
2. Verify the JSON is valid (no syntax errors)
3. Check browser console for errors
4. Ensure the section exists for the correct page identifier

### JSON Validation Errors

If you see "Invalid JSON" errors:
- Use a JSON validator to find the error
- Common issues: missing commas, unclosed brackets, unquoted strings
- Copy a working section's format as a template

### Section Shows Old Content

- Clear your browser cache
- Check you saved the correct page identifier
- Verify you're viewing the correct industry page URL

---

## Example: Complete Edit Workflow

**Goal:** Add a new solution to the Healthcare page

1. Navigate to **Admin → Page Sections**
2. Filter by **"Healthcare & Life Sciences"**
3. Click on **"Solutions Section"**
4. In the **Content** field, find the `solutions` array
5. Add your new solution:

```json
{
  "title": "My New Solution",
  "description": "This is what my solution does",
  "icon": "rocket"
}
```

6. Click **Save**
7. Visit `http://localhost:3000/industries/healthcare`
8. Your new solution card should appear!

---

## Need Help?

- For JSON formatting: https://jsonlint.com/
- For icon names: See "Available Icons" section above
- For technical issues: Check the browser console (F12) for errors

---

## Best Practices

1. **Always validate JSON** before saving
2. **Make small changes** and test frequently
3. **Keep descriptions concise** - aim for 1-2 sentences
4. **Use consistent formatting** across all industries
5. **Back up content** before major edits (copy JSON to a text file)
6. **Test on mobile** after making changes

---

## Advanced: Bulk Updates

To update multiple industry pages at once:

1. Create a data file with your changes
2. Run the population command:
   ```bash
   python manage.py populate_industry_pages
   ```

Note: This will overwrite existing content, so use with caution!

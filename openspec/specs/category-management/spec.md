# category-management Specification

## Purpose
Gives the user a dedicated place to create, rename, re-style, and delete their reusable categories, so a correction or a new emoji is made once and reflected everywhere that category is used across their concepts.

## Requirements

### Requirement: Categorías screen is reachable from primary navigation
The system SHALL provide a "Categorías" link in the main navigation header, alongside Dashboard and Deudas, that navigates to a screen listing the user's categories.

#### Scenario: Navigating to Categorías
- **WHEN** the user activates the "Categorías" link in the header
- **THEN** the app navigates to the Categorías screen and shows the user's current categories

### Requirement: Create a category
The system SHALL let the user create a new category from the Categorías screen by entering a name.

#### Scenario: Creating a category
- **WHEN** the user submits a new category name from the Categorías screen
- **THEN** the category appears in the list, available for assignment to any concept

### Requirement: Rename or re-style a category
The system SHALL let the user rename a category and set or change its emoji, choosing the emoji from the fixed curated set the backend accepts.

#### Scenario: Renaming a category updates it everywhere
- **WHEN** the user renames a category that is assigned to one or more concepts
- **THEN** those concepts subsequently display the new name without any further action from the user

#### Scenario: Setting a category's emoji
- **WHEN** the user picks an emoji for a category from the fixed set
- **THEN** the category and every concept displaying it show that emoji

#### Scenario: Emoji picker only offers the fixed set
- **WHEN** the user opens the emoji picker for a category
- **THEN** only the fixed curated set of emojis is offered, with no free-text or open emoji-keyboard entry

### Requirement: Delete a category
The system SHALL let the user delete a category from the Categorías screen. Deleting a category SHALL NOT require confirming or reassigning the concepts that use it.

#### Scenario: Deleting a category
- **WHEN** the user deletes a category
- **THEN** the category no longer appears in the list, and any concept that had it assigned no longer shows it (while keeping any other categories it had)

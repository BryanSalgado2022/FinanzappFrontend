# task-management Specification

## Purpose
Gives the user a dedicated place to create and track generic reminders and appointments — independent of any financial concept — so day-to-day to-dos have a home in the app without being tied to a debt, expense, or income entry.

## Requirements

### Requirement: Tareas screen is reachable from primary navigation
The system SHALL provide a "Tareas" link in the main navigation header, alongside Dashboard, Deudas, and Categorías, that navigates to a screen listing the user's tasks.

#### Scenario: Navigating to Tareas
- **WHEN** the user activates the "Tareas" link in the header
- **THEN** the app navigates to the Tareas screen and shows the user's current tasks

### Requirement: Task list is ordered by date with undated tasks grouped separately
The system SHALL display tasks ordered by `fecha` ascending (soonest first), with tasks that have no `fecha` set grouped together in their own section separate from the dated tasks.

#### Scenario: Dated tasks are ordered soonest first
- **WHEN** the user has multiple tasks with different dates
- **THEN** the list shows them in ascending date order

#### Scenario: Undated tasks appear in their own section
- **WHEN** the user has one or more tasks with no `fecha` set
- **THEN** those tasks are shown together in a section separate from the dated tasks, rather than interleaved with them

### Requirement: Create a task
The system SHALL let the user create a task via a modal form, entering a required title and optionally an emoji (from the fixed allowed set), date, time, and note.

#### Scenario: Creating a task with just a title
- **WHEN** the user submits the creation form with only a title
- **THEN** a new task is created with no emoji, date, time, or note, and appears in the undated section

#### Scenario: Creating a task with all fields
- **WHEN** the user submits the creation form with a title, an emoji, a date, a time, and a note all provided
- **THEN** a new task is created with all of those values and appears in the dated section in its correct chronological position

#### Scenario: Date and time can be set independently
- **WHEN** the user sets only a time without a date, or only a date without a time
- **THEN** the form accepts it and creates the task with exactly the fields provided

### Requirement: Edit and delete a task
The system SHALL let the user edit any of a task's fields and delete a task, using an inline expandable row in the list.

#### Scenario: Editing a task's details
- **WHEN** the user expands a task row and changes its title, emoji, date, time, or note, then saves
- **THEN** the task reflects the updated values and the list re-sorts if the date changed

#### Scenario: Deleting a task
- **WHEN** the user deletes a task from its expanded row
- **THEN** the task no longer appears in the list

### Requirement: Mark a task completed
The system SHALL let the user toggle a task's completed status directly from the list, independent of any emoji it has.

#### Scenario: Marking a task completed
- **WHEN** the user marks a task as completed
- **THEN** the task reflects its completed status and is no longer shown as overdue, even if its date has passed

#### Scenario: Marking a completed task as not completed
- **WHEN** the user un-marks a previously completed task
- **THEN** the task reflects its pending status, and shows as overdue again if its date is in the past

### Requirement: Overdue tasks are visually distinguished
The system SHALL visually distinguish, in the task list, a task the backend reports as overdue (`vencida`) from one that is merely undated or upcoming, using the same visual treatment already used for overdue monthly entries.

#### Scenario: Overdue task stands out
- **WHEN** a task is reported as overdue
- **THEN** its visual treatment in the list differs from a pending task that is not overdue, consistent with how overdue monthly entries are shown elsewhere in the app

#### Scenario: Completed tasks are never shown as overdue
- **WHEN** a task is completed
- **THEN** the list does not show it with the overdue treatment, regardless of its date

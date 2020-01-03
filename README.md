![Weborg Logo](https://github.com/Patrickskiba/weborg/blob/master/docs/weborg-banner.png)
 A progressive web application to complement your existing Org-mode notes by providing a mobile friendly experience.
 
 While it does work in any modern browser it is primarily meant for mobile devices. As of right now Weborg is a work in progress.
  
 ## What is Org-mode
 If you aren't familar with Org-mode, it is a markup language specificially written as a library for the text editor Emacs.
 
 You can use Org-mode for keeping notes, maintaining TODO lists, planning projects, and authoring documents with a fast and   effective plain-text system.
 
 ### Example
 A simple example of a Org-mode file could be this list of Todo's below
![orgmode-sample_003](https://user-images.githubusercontent.com/5651648/71720256-0c98de00-2def-11ea-92f0-8311e2878b8b.png)

The equivalent text in Weborg would produce the following UI for reading and editing on the go.
![orgmode-weborg_000](https://user-images.githubusercontent.com/5651648/71720584-3b638400-2df0-11ea-9463-e4ee36ebe6ea.png)
 ## Features
 ### Basic Note Editing
 - Adding, editing and deleting notes
 - Collapsing and expanding notes
 - Rearranging notes
 - Quickly promoting and demoting notes
 - TODOs, priorities, text styling (i.e. bold, italic, underlined, strikethrough)
 - Agenda view that searches for deadlines and scheduled tasks for the current week
 ### Other Features
 - Syncing with dropbox
 - Install to your home screen
 - Offline editing
 
 ## Future Features
 - Agenda-mode that integrates with an internal and external calendar
 - Other cloud storage providers (Google drive, Owncloud)
 - A desktop friendly layout
 - Export to pdf, markdown, latex and html
 - Org-tables with support for formulas 

 ## Features too cutting edge at the moment
 #### Push notifications for deadlines and scheduled tasks
 There is a proposed feature in Google Chrome called Notification Triggers. It is currently available through the expiremental flag, you can read more about it here: https://www.chromestatus.com/feature/5133150283890688
 
 The purpose of this feature is to allow offline push notifications that get triggered at a scheduled time in the future without the need of a server.
 
 Currently, the only way to create push notifications with a progressive web app is by having a server ping a user's device with the contents of the notification.
 
 I don't want to incorporate a server side api with this project, a choice that is both cost effective for me and protects user's privacy by keeping all their notes on their phone and not on a remote server **unless you give all your notes to dropbox like I do :)**.

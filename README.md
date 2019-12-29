![Weborg Logo](https://github.com/Patrickskiba/weborg/blob/master/docs/weborg-banner.png)
 A progressive web application to complement your existing Org-mode notes by providing a mobile friendly experience.
 
 ## Features
 ### Basic Note Editing
 - Adding, editing and deleting notes
 - Collapsing and expanding notes
 - Rearranging notes
 - Quickly promoting and demoting notes
 - TODOs, priorities, text formatting
 ### Other Features
 - Syncing with dropbox
 - Install to your home screen
 - Offline editing
 
 ## Future Features
 - Agenda-mode that integrates with an internal and external calendar
 - Other cloud storage providers (Google drive, Owncloud)
 - Export to pdf, markdown, latex and html
 - Org-tables with support for formulas 

 ## Features too cutting edge at the moment
 #### Push notifications for deadlines and scheduled tasks
 There is a proposed feature in Google Chrome called Notification Triggers. It is currently available through the expiremental flag, you can read more about it here: https://www.chromestatus.com/feature/5133150283890688
 
 The purpose of this feature is to allow offline push notifications that get triggered at a scheduled time in the future without the need of a server.
 
 Currently, the only way to create push notifications with a progressive web app is by having a server ping a user's device with the contents of the notification.
 
 I don't want to incorporate a server side api with this project, a choice that is both cost effective for me and protects user's privacy by keeping all their notes on their phone and not on a remote server **unless you give all your notes to dropbox like I do :)**.

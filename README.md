# SAR-Bot
Essentially just a discord bot to check people's stats in SAR. 

# Notes
Was a bit too lazy to add a try-catch for invalid ID's, but it does check to make sure an ID is actually inserted. If its invalid, it simply won't reply to the message.

Commands are solo, duos, and squads

To use, you will need a file named auth.json, formatted as such:
{
  "token": "(bot token goes here)",
  "prefix": "$" (or desired prefix within the quotes)
}

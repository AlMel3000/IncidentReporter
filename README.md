# IncidentReporter(react-native)

# About

==================================================

Developed in IntelliJ IDEA 


==================================================



# Project structure

       IncidentReporter
        |
        \= android                  <-- android resource folder
            \= app 
               |= notarization.keystore    <-- Google Play publishing sertificate   
        |
        |= app                         <-- main source code
        \
            |
            |
            \= container             <-- react-navigation container
            |
            \= views            
              |
               |= assets              <-- resources
               |= data                <-- mock data, global colors for application
               |= screens             <-- App screens
               |= ui_elements       ``<-- StaleLess & stateFull components            
                                         
        \= ios                       
         |
          \= IncidentReporter                  <--  iOS resource folder
             
        |
        |= index.js                   <--  entry point
        
        
        

# Possible improvements

To add button for chosing/picking photo - when photo area is empty

To implement contacts storing on Main Screen
To implement passing of selected contacts from Main scrren to Contacts screen - for checkbox behavior improvement

To pass to email app all selected/picked images - only the one image currently is passing to email message

# Known issues 

On deletion images currently here may be mistakes if we delete in random order
               
        
       


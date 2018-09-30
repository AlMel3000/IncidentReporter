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
        
        
      
# Assignment as it is

Задание:
* Спроектировать и разработать простое React Native приложение для создания и отправки отчетов о проблемах (Incident Reports) - из трех скринов. Прикреплены дизайны этих скринов, а также screen flow диаграмма. Основные возможности:
- Создание нового отчета включая заполнение поля Description и добавление фотографий из галереи или через камеру.
- Упрощение - вместо полей Highway, Direction, Exit letter, Km используй просто GPS координаты положения устройства, которые должны заполняться автоматически.
- Отправка отчета по email - кнопка отправки отчета должна открывать стандартный email app устройства с готовым к отправке сообщением (включая все данные и фото из отчета в свободном формате). Получатель письма - либо выбранный пользователь, либо пустое поле, если никто не выбран.
- Выбор пользователя из списка - для тестовых целей можно захардкодить список из двух пользователей (используй mock).
* Прикрепленные дизайны сделаны для планшета, но приложение должно будет работать в первую очередь на смартфоне (Android и/или iPhone). Строгое следование прикрепленным дизайнам необязательно, можно что-то менять для адаптации к размеру экрана смартфона. Это будет оценено в плюс.
* Возможные упрощения, которые не скажутся на оценке:
- Экран выбора пользователя можно сделать максимально простым - список.
- Добавление только одной фотографии вместо нескольких.
* Основные моменты, по которым будет оцениваться задание:
- Качество кода.
- Наличие и работоспособность основного функционала.
- UX - удобство и красота пользовательского интерфейса (за исключением скрина выбора пользователя, который можно упростить).

Для проверки нужен будет apk или ipa файл приложения, а также git-репозиторий с кодом.  

# Possible improvements

To add button for chosing/picking photo - when photo area is empty

To implement contacts storing on Main Screen
To implement passing of selected contacts from Main scrren to Contacts screen - for checkbox behavior improvement

To pass to email app all selected/picked images - only the one image currently is passing to email message

# Known issues 

On deletion images currently here may be mistakes if we delete in random order
               
        
       


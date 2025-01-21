# AGH-Wprowadzanie-do-aplikacji-internetowych-projekt
---
## Autorzy:
1. Paweł Sosnowski
2. Mateusz Ziajka

---
## Nazwa projektu - mały sklep internetowy
Projekt jest aplikacją webową przedstawiającą mały sklep internetowy z produktami. Posiada on podstawowe funkcje sklepu.

---
## Technologie
1. **Backend** - użyta technologia to Node.js, Express oraz Sequelize to tworzenia zapytań do bazy. Do autentykacji użytkowików został użyty mechanizm tokenów JWT.
2. **Frontend** - użyta technologia to React oraz skorzystanie z React Router.
3. **Database** - baza danych to SQLite
4. **Inne** - został użyty Postman do testowania oraz zrobienia dokumentacji API.

---
## Setup projektu
Setup dzieli się na kilka poleceń i etapów:
1. Zaczynamy od sklonowania repozytorium
```bash
git clone https://github.com/FaFikPL367/AGH-Wprowadzanie-do-aplikacji-internetowych-projekt.git
cd AGH-Wprowadzenie-do-aplikacji-internetowych-projekt
```

2. Należy wejść do sklonowanego repozytorium i pobrać zaleźności. Po wpisaniu poniższej komendy pobiarą się wszystkie zależności.
```bash
npm run install:all
```

3. Odpalenie projektu. Stronę serwerową i fornotwą można odpalić za pomocą jednej komendy.
```bash
npm start
```

4. Frontend i backend odpalają się lokalnie: front na porcie: 5137, a backend na 3000

---
## Funkcjonalność
1. **Obsługa użytkowników**
   1. Możliwość logowania użytkownika
   2. Możliwość zakładania konta przez użytkownika
   3. Wszystko odbywa się na podstawie autoryzajic JWT tokenem
2. **Obsługa produktów**
   1. Możliwość zobaczenie dostępnych produktów oraz zobaczenia ich szczegółów
   2. W przypadku ADMINA dostęp do dodawania i usuwania produktów 
3. **Obsługa koszyka**
   1. Możliwość dodania produktów do koszyka oraz ich usunięcia
   2. Możliwość zwiększenia ilości danego produktu już w koszyku
   3. Wszystkie operacji powyższe dostępne są dla zalogowanych użytkowników
4. **Obsługa zamówień**
   1. Możliwość złożenia zamówienia przez użytkownika wiążące się z podaniem adresu wysyłki
   2. Możliwość zobaczenia wszystkich złożonych zamówień przez użytkownika 
   3. Możliwość wejścia w dane zamówienia i zobaczenie jego szczegółów
5. **Obsługa recenzji**
   1. Możliwość zostawienia opinii przez użytkownika pod danym produktem
   2. Możliwość usunięcia swojej opinii przez użytkonika
   3. Wyliczanie ogólnej oceny danego produktu

---
## Dokumentacja API
Cała dokumentacja znajduje się pod linkiem:
```URL
https://documenter.getpostman.com/view/39993165/2sAYQamX2w
```




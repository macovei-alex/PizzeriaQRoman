# Functionalitatile clientului

### Cont

- creearea unui cont cu
  - cont google + numar telefon
  - adresa email + parola + numar telefon
- fiecare cont are **exact 1** numar de telefon
- asocierea contului cu adrese de livrare
- optional: crearea unei adrese de livrare odata cu contul
- adaugarea si stergerea unei adrese de livrare

### Profil

- schimbarea parolei contului
- vizualizarea si schimbare adresei de email asociate
- modificare adrese asociate
- istoric de comenzi

### Meniu

- nume produse
- preturile intregi si preturile cu discount global aplicat
- imagini produse
- descrieri produs (trunchiate)

### Produs

- descrierea produsului (gramaje, valori nutritionale, alergeni, etc.)
- listele de optiuni (text, numar minim de optiuni, numar maxim de optiuni)
  - daca lista are numar minim 0 atunci alegerea unei optiuni nu este obligatorie
- optiunile din fiecare lista (nume, descriere optionala, pret)
- optiunile au un numar minim si maxim de bucati
  - daca optiunea are numar minim 0 atunci ea nu este obligatorie
  - daca optiunea are numar maxim 1 atunci ea este de tip *checkbox*
  - altfel, interfata arata butoane de **\+** si **\-** la optiune
<!-- - optiunile cu numar maxim **> 1** se vor considera ca **0 sau 1** la numararea acestora in lista astfel:
  - daca optiunea are numar **0** atunci ea se numara ca **0**
  - daca optiunea are numar **> 0** atunci ea se numara ca **1** -->
- introducerea in cos a unuia sau mai multor produse cu optiunile alese
- pretul total al produselor introduse dupa alegerea optiunilor si a numarului de bucati dorite

### Cos

- adaugarea de produse la o comanda
- vizualizarea cosului de produse
- marirea sau scaderea numarului de bucati pentru un produs
  - daca dupa scaderea numarului de bucati produsul are 0 bucati ramase, atunci se va sterge din cos
- afisarea pretului per produs (`nr. bucati * pret`) si al cosului
- alegerea adresei de livrare (implicit ultima adresa folosita)
- adaugarea de mentiuni speciale la o comanda

# Nelamuriri

- la fiecare comanda, pe langa discountul global al fiecarui produs:
  - cupon cu 1 discount la valoarea totala a comenzii
  sau
  - cupon cu aceeasi reducere la 0 sau mai multe produse?
- reduceri de 2 tipuri: procent sau absolut
  - pentru cupoane?
  - pentru reducerile globale?




<!--
Italic, Bold, Bold+Italic:
  *text*, **text**, ***text***

Strikthrough:
  ~~text~~

Horizontal line:
  ---

Block quote:
  > text

Link:
  [text](https://google.com)

Image:
  ![placeholder text](https://via.placeholder.com/150)

Code inline:
  `int a = b + c;`

Code block:
```python
def hello_world():
    print("Hello, World!")
```
-->

## TODO

- [ ] possibilità di specificare orari e note oppure ordinare gli elementi sulle navette;
- [ ] chat;
- [ ] verifiche usabilità
- [ ] deploy
- [ ] sessione privata (???):
  - in fase di creazione indicare l'opzione "private"
  - ogni nuovo utente deve essere abilitato da uno esistente
  - (complicazione) > devi riconoscere chi entra magari dall'ip??
    - quindi salvare l'elenco degli owners (la vedo complicata)


## struttura della pagina

- accesso o definizione della sessione (stile meet)
- sessione
  - definizione del calendario
    - per ogni giorno della settimana
      - orari di allenamento x gruppo
      - luogo allenamento x gruppo
  - anagrafica dei soggetti
- visualizzazione giornaliera
  - atleti presenti
  - disponibilità navette
  - inserimento automatico delle navette necessarie A/R (modificabile)
    - associazione atleta navetta A/R
- visualizzazione mensile


## FASE II

- [x] login con codice
  - [x] informative sulla pagina di accesso
 
- [ ] pagina di primo accesso con informativa e introduzione
  - informativa (*)
  - stato sessione:
    - creata per la prima volta:
      - passa wizard per la sessione
    - gia creata
      - passa direttamente nella navetta giornaliera


- modalità di utilizzo estemporaneo (sessione vuota)
- impostazioni su procedura wizard
  - elenco gruppi (potenzialemnte con orari diversi)
  - calendario attività per gruppo
  - elenco soggeti trasportati
  - elenco soggetti trasportatori
- impostazioni su pagina estesa (senza gruppi più leggibile e grande)
- vista giornaliera con indispensabile:
  - data corrente
  - appello presenti con possibiltà di aggiungere elenmenti presenti solo per l'occasione
  - indicazione delle attività giornaliere come da calendario con possibilità di variazione estemporanea
  - costruzione delle navette di A/R
    - indicazione del guidatore
    - lista dei trasportati
    - orari per trasportato se richiesto sia in A che R
- se le navette sono complete mostra solo quelle (salvo richiesta esplicita)


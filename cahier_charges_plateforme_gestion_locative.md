# CAHIER DES CHARGES
## Plateforme SaaS de Gestion Locative Complète
### Gestion des Loyers, Électricité et Paiements en Ligne

---
ssh://git@localhost:2424/vortex/node-js/loka-api.git
## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
Développement d'une **plateforme SaaS multi-tenant** permettant aux propriétaires immobiliers de gérer intégralement leurs biens locatifs (loyers, charges, électricité, paiements) et aux locataires d'accéder à leur espace personnel pour suivre leurs locations, payer en ligne et consulter leurs historiques.

### 1.2 Vision du projet
**"La solution tout-en-un pour la gestion locative moderne en Afrique"**

Une plateforme cloud accessible 24/7 qui digitalise complètement la relation propriétaire-locataire, élimine la paperasse, automatise les rappels, et facilite les paiements en ligne via Mobile Money.

### 1.3 Objectifs principaux

#### Pour les propriétaires
- Gérer plusieurs propriétés depuis un seul compte
- Suivre les loyers et charges (eau, électricité) en temps réel
- Automatiser la facturation et les rappels
- Recevoir les paiements en ligne instantanément
- Accéder à des statistiques détaillées et rapports financiers
- Réduire les impayés grâce aux notifications automatiques

#### Pour les locataires
- Espace personnel unique pour toutes leurs locations
- Payer en ligne 24/7 (Mobile Money, carte bancaire)
- Consulter historique des paiements et factures
- Recevoir des notifications avant échéance
- Télécharger leurs quittances de loyer
- Soumettre des demandes de maintenance

#### Pour la plateforme
- Modèle d'affaires SaaS avec abonnements
- Commission sur transactions en ligne
- Scalabilité pour des milliers d'utilisateurs
- Conformité légale et fiscale

### 1.4 Périmètre fonctionnel
Le système couvre :
- Gestion multi-propriétés et multi-locataires
- Facturation loyers + charges (électricité, eau, ordures)
- Paiements en ligne sécurisés
- Relevés de compteurs (électricité, eau)
- Contrats de location digitaux
- Notifications automatiques multi-canaux
- Rapports financiers et statistiques
- Gestion des maintenances
- Documents et archivage

---

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Stack technologique

#### Backend
- **Langage** : Node.js avec TypeScript
- **Framework** : Express.js
- **Base de données** : PostgreSQL 14+
- **Cache** : Redis
- **Queue** : Bull (pour jobs asynchrones)
- **ORM** : Prisma ou TypeORM
- **Validation** : Joi ou Zod

#### Frontend
- **Framework** : React.js 18+ avec TypeScript
- **UI Library** : Material-UI ou Ant Design
- **State Management** : Redux Toolkit ou Zustand
- **Routing** : React Router v6
- **Forms** : React Hook Form
- **HTTP Client** : Axios

#### Infrastructure
- **Cloud** : AWS, Google Cloud ou Azure
- **Conteneurisation** : Docker
- **CI/CD** : GitHub Actions ou GitLab CI
- **Monitoring** : Sentry, DataDog
- **Logs** : Winston + CloudWatch

#### Intégrations
- **Paiements** : 
  - TMoney API (Togo)
  - Flooz API (Togo)
  - Stripe (cartes internationales)
  - Moov Money (Togo/Bénin)
  - Orange Money
  - Wave
- **SMS** : Twilio, Africa's Talking
- **Email** : SendGrid, AWS SES
- **WhatsApp** : WhatsApp Business API
- **Stockage** : AWS S3 ou Google Cloud Storage
- **PDF** : Puppeteer ou PDFKit

### 2.2 Architecture système

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE PRÉSENTATION                       │
├─────────────────────────────────────────────────────────────┤
│  Webapp Propriétaires  │  Webapp Locataires  │  Admin Panel │
│     (React.js)         │    (React.js)       │   (React.js) │
└──────────────┬─────────┴─────────────┬───────┴──────────────┘
               │                       │
               ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│              (Load Balancer + Auth)                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   MICROSERVICES (Node.js)                    │
├─────────────────────────────────────────────────────────────┤
│ Auth Service │ Property Service │ Payment Service           │
│ Billing Service │ Notification Service │ Report Service     │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)  │  Redis (Cache)  │  S3 (Storage)    │
└─────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│ TMoney │ Flooz │ Stripe │ SMS Gateway │ Email Service       │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Modèle SaaS Multi-tenant
- **Isolation des données** : Chaque propriétaire a ses propres données isolées
- **Authentification** : JWT avec refresh tokens
- **Abonnements** : Plans Basique, Pro, Enterprise
- **Scalabilité** : Architecture horizontale

---

## 3. MODÈLE DE DONNÉES COMPLET

### 3.1 Entités principales

#### 3.1.1 Table : **landlords** (Propriétaires)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| user_id | UUID | Référence au compte utilisateur |
| company_name | VARCHAR(200) | Nom de l'entreprise (optionnel) |
| business_type | ENUM | Particulier, Entreprise, Agence |
| tax_id | VARCHAR(100) | Numéro fiscal |
| registration_number | VARCHAR(100) | Numéro d'enregistrement |
| phone_primary | VARCHAR(20) | Téléphone principal |
| phone_secondary | VARCHAR(20) | Téléphone secondaire |
| email | VARCHAR(200) | Email professionnel |
| address | TEXT | Adresse |
| city | VARCHAR(100) | Ville |
| country | VARCHAR(100) | Pays |
| subscription_plan | ENUM | Basic, Pro, Enterprise |
| subscription_status | ENUM | Active, Suspended, Cancelled |
| subscription_start_date | DATE | Début abonnement |
| subscription_end_date | DATE | Fin abonnement |
| payment_methods | JSONB | Méthodes de paiement acceptées |
| bank_account_iban | VARCHAR(100) | IBAN (pour virements) |
| mobile_money_number | VARCHAR(20) | Numéro Mobile Money |
| commission_rate | DECIMAL(5,2) | Taux de commission (%) |
| total_properties | INTEGER | Nombre de propriétés |
| total_units | INTEGER | Nombre total d'unités |
| is_verified | BOOLEAN | Compte vérifié |
| verification_documents | JSONB | Documents de vérification |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.2 Table : **properties** (Propriétés/Immeubles)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| landlord_id | UUID | Référence au propriétaire |
| property_name | VARCHAR(200) | Nom de la propriété |
| property_type | ENUM | Immeuble, Maison, Résidence, Commerce |
| address | TEXT | Adresse complète |
| city | VARCHAR(100) | Ville |
| neighborhood | VARCHAR(100) | Quartier |
| postal_code | VARCHAR(20) | Code postal |
| country | VARCHAR(100) | Pays |
| gps_coordinates | POINT | Coordonnées GPS |
| construction_year | INTEGER | Année de construction |
| total_units | INTEGER | Nombre total d'unités |
| total_floors | INTEGER | Nombre d'étages |
| property_description | TEXT | Description détaillée |
| amenities | JSONB | Équipements (piscine, parking, etc.) |
| property_photos | JSONB | URLs des photos |
| property_documents | JSONB | Documents (titre foncier, etc.) |
| electricity_meter_id | VARCHAR(100) | Compteur principal |
| water_meter_id | VARCHAR(100) | Compteur d'eau principal |
| property_status | ENUM | Active, Inactive, Under_Construction |
| is_published | BOOLEAN | Visible sur plateforme |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.3 Table : **rental_units** (Unités locatives - chambres/appartements)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| property_id | UUID | Référence à la propriété |
| unit_number | VARCHAR(50) | Numéro d'unité |
| unit_name | VARCHAR(100) | Nom de l'unité |
| unit_type | ENUM | Studio, Chambre, T1, T2, T3, T4, Bureau |
| floor | INTEGER | Étage |
| surface_area | DECIMAL(10,2) | Surface (m²) |
| number_of_rooms | INTEGER | Nombre de pièces |
| number_of_bathrooms | INTEGER | Nombre de salles de bain |
| is_furnished | BOOLEAN | Meublé ou non |
| furniture_list | JSONB | Liste des meubles |
| amenities | JSONB | Équipements (clim, wifi, etc.) |
| electricity_meter_id | VARCHAR(100) | Compteur électricité |
| water_meter_id | VARCHAR(100) | Compteur eau |
| initial_electricity_reading | DECIMAL(10,2) | Index initial électricité |
| initial_water_reading | DECIMAL(10,2) | Index initial eau |
| monthly_rent | DECIMAL(10,2) | Loyer mensuel |
| security_deposit | DECIMAL(10,2) | Caution |
| electricity_included | BOOLEAN | Électricité incluse dans loyer |
| water_included | BOOLEAN | Eau incluse dans loyer |
| unit_status | ENUM | Available, Occupied, Reserved, Maintenance |
| unit_photos | JSONB | Photos de l'unité |
| description | TEXT | Description |
| special_terms | TEXT | Conditions particulières |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.4 Table : **tenants** (Locataires)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| user_id | UUID | Référence au compte utilisateur |
| first_name | VARCHAR(100) | Prénom |
| last_name | VARCHAR(100) | Nom de famille |
| full_name | VARCHAR(200) | Nom complet (généré) |
| date_of_birth | DATE | Date de naissance |
| gender | ENUM | Male, Female, Other |
| nationality | VARCHAR(100) | Nationalité |
| phone_primary | VARCHAR(20) | Téléphone principal |
| phone_secondary | VARCHAR(20) | Téléphone secondaire |
| email | VARCHAR(200) | Email |
| id_card_type | VARCHAR(50) | Type pièce d'identité |
| id_card_number | VARCHAR(100) | Numéro pièce |
| id_card_expiry | DATE | Date expiration |
| id_card_front_url | VARCHAR(500) | Photo recto |
| id_card_back_url | VARCHAR(500) | Photo verso |
| occupation | VARCHAR(200) | Profession |
| employer_name | VARCHAR(200) | Employeur |
| employer_contact | VARCHAR(100) | Contact employeur |
| monthly_income | DECIMAL(10,2) | Revenu mensuel |
| emergency_contact_name | VARCHAR(200) | Contact d'urgence nom |
| emergency_contact_phone | VARCHAR(20) | Contact d'urgence tel |
| emergency_contact_relationship | VARCHAR(100) | Relation |
| references | JSONB | Références (anciens propriétaires) |
| payment_preference | ENUM | Mobile_Money, Bank_Transfer, Cash |
| mobile_money_number | VARCHAR(20) | Numéro Mobile Money |
| bank_account_iban | VARCHAR(100) | IBAN |
| is_blacklisted | BOOLEAN | Liste noire |
| blacklist_reason | TEXT | Raison blacklist |
| tenant_rating | DECIMAL(3,2) | Note (0-5) |
| total_rentals | INTEGER | Nombre de locations |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.5 Table : **rental_contracts** (Contrats de location)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| contract_number | VARCHAR(100) | Numéro de contrat |
| landlord_id | UUID | Référence au propriétaire |
| property_id | UUID | Référence à la propriété |
| unit_id | UUID | Référence à l'unité |
| tenant_id | UUID | Référence au locataire |
| contract_type | ENUM | Fixed_Term, Renewable, Month_to_Month |
| contract_start_date | DATE | Date début |
| contract_end_date | DATE | Date fin |
| notice_period_days | INTEGER | Préavis (jours) |
| monthly_rent | DECIMAL(10,2) | Loyer mensuel |
| security_deposit | DECIMAL(10,2) | Caution |
| deposit_paid | BOOLEAN | Caution payée |
| deposit_payment_date | DATE | Date paiement caution |
| rent_due_day | INTEGER | Jour échéance (1-31) |
| late_fee_percentage | DECIMAL(5,2) | Pénalité retard (%) |
| late_fee_grace_days | INTEGER | Jours de grâce |
| electricity_included | BOOLEAN | Électricité incluse |
| water_included | BOOLEAN | Eau incluse |
| electricity_rate_per_kwh | DECIMAL(10,2) | Tarif électricité |
| water_rate_per_m3 | DECIMAL(10,2) | Tarif eau |
| other_charges | JSONB | Autres charges (ordures, etc.) |
| initial_electricity_reading | DECIMAL(10,2) | Index électricité début |
| initial_water_reading | DECIMAL(10,2) | Index eau début |
| payment_method | ENUM | Mobile_Money, Bank, Cash, Online |
| auto_renewal | BOOLEAN | Renouvellement automatique |
| special_terms | TEXT | Clauses particulières |
| contract_document_url | VARCHAR(500) | PDF du contrat |
| contract_status | ENUM | Draft, Active, Expired, Terminated, Suspended |
| termination_date | DATE | Date résiliation |
| termination_reason | TEXT | Raison résiliation |
| termination_by | ENUM | Landlord, Tenant, Mutual |
| final_electricity_reading | DECIMAL(10,2) | Index électricité fin |
| final_water_reading | DECIMAL(10,2) | Index eau fin |
| deposit_refund_amount | DECIMAL(10,2) | Montant caution rendu |
| deposit_refund_date | DATE | Date remboursement |
| is_signed_by_landlord | BOOLEAN | Signé par propriétaire |
| is_signed_by_tenant | BOOLEAN | Signé par locataire |
| landlord_signature_url | VARCHAR(500) | Signature propriétaire |
| tenant_signature_url | VARCHAR(500) | Signature locataire |
| signed_at | TIMESTAMP | Date signature |
| notes | TEXT | Notes |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.6 Table : **rent_invoices** (Factures de loyer)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| invoice_number | VARCHAR(100) | Numéro de facture |
| invoice_type | ENUM | Rent, Electricity, Water, Other |
| landlord_id | UUID | Référence au propriétaire |
| property_id | UUID | Référence à la propriété |
| unit_id | UUID | Référence à l'unité |
| tenant_id | UUID | Référence au locataire |
| contract_id | UUID | Référence au contrat |
| billing_period_start | DATE | Début période |
| billing_period_end | DATE | Fin période |
| billing_year | INTEGER | Année |
| billing_month | INTEGER | Mois |
| due_date | DATE | Date d'échéance |
| base_rent | DECIMAL(10,2) | Loyer de base |
| electricity_charge | DECIMAL(10,2) | Charge électricité |
| water_charge | DECIMAL(10,2) | Charge eau |
| garbage_fee | DECIMAL(10,2) | Frais ordures |
| maintenance_fee | DECIMAL(10,2) | Frais entretien |
| other_charges | JSONB | Autres charges détaillées |
| subtotal | DECIMAL(10,2) | Sous-total |
| tax_amount | DECIMAL(10,2) | Montant taxes |
| tax_rate | DECIMAL(5,2) | Taux de taxe (%) |
| discount_amount | DECIMAL(10,2) | Remise |
| discount_reason | TEXT | Raison remise |
| total_amount | DECIMAL(10,2) | Montant total |
| amount_paid | DECIMAL(10,2) | Montant payé |
| balance_due | DECIMAL(10,2) | Solde restant |
| invoice_status | ENUM | Draft, Sent, Partially_Paid, Paid, Overdue, Cancelled |
| sent_at | TIMESTAMP | Date d'envoi |
| paid_at | TIMESTAMP | Date paiement complet |
| payment_deadline_passed | BOOLEAN | Échéance dépassée |
| days_overdue | INTEGER | Jours de retard |
| late_fee_applied | DECIMAL(10,2) | Pénalité appliquée |
| invoice_pdf_url | VARCHAR(500) | PDF de la facture |
| notes | TEXT | Notes |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.7 Table : **payments** (Paiements)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| payment_reference | VARCHAR(100) | Référence unique |
| transaction_id | VARCHAR(200) | ID transaction externe |
| landlord_id | UUID | Référence au propriétaire |
| tenant_id | UUID | Référence au locataire |
| contract_id | UUID | Référence au contrat |
| payment_date | DATE | Date du paiement |
| amount_paid | DECIMAL(10,2) | Montant payé |
| payment_method | ENUM | Cash, Mobile_Money, Bank_Transfer, Credit_Card, Online_Payment |
| payment_provider | VARCHAR(100) | TMoney, Flooz, Stripe, etc. |
| payment_status | ENUM | Pending, Processing, Completed, Failed, Refunded |
| currency | VARCHAR(10) | Devise (XOF, EUR, USD) |
| exchange_rate | DECIMAL(10,4) | Taux de change |
| payment_fee | DECIMAL(10,2) | Frais de transaction |
| net_amount | DECIMAL(10,2) | Montant net reçu |
| platform_commission | DECIMAL(10,2) | Commission plateforme |
| landlord_amount | DECIMAL(10,2) | Montant net propriétaire |
| payer_phone | VARCHAR(20) | Téléphone payeur |
| payer_email | VARCHAR(200) | Email payeur |
| receipt_number | VARCHAR(100) | Numéro de reçu |
| receipt_url | VARCHAR(500) | PDF du reçu |
| is_automatic | BOOLEAN | Paiement automatique |
| recurring_payment_id | UUID | ID paiement récurrent |
| payment_proof_url | VARCHAR(500) | Preuve de paiement |
| payment_notes | TEXT | Notes sur le paiement |
| processed_at | TIMESTAMP | Date de traitement |
| reconciled | BOOLEAN | Rapproché |
| reconciled_at | TIMESTAMP | Date rapprochement |
| refund_reason | TEXT | Raison du remboursement |
| refunded_at | TIMESTAMP | Date remboursement |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.8 Table : **payment_allocations** (Affectation des paiements)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| payment_id | UUID | Référence au paiement |
| invoice_id | UUID | Référence à la facture |
| allocated_amount | DECIMAL(10,2) | Montant affecté |
| allocation_type | ENUM | Principal, Late_Fee, Adjustment |
| created_at | TIMESTAMP | Date d'affectation |

#### 3.1.9 Table : **meter_readings** (Relevés de compteurs)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| landlord_id | UUID | Référence au propriétaire |
| property_id | UUID | Référence à la propriété |
| unit_id | UUID | Référence à l'unité |
| tenant_id | UUID | Référence au locataire |
| contract_id | UUID | Référence au contrat |
| meter_type | ENUM | Electricity, Water, Gas |
| reading_date | DATE | Date du relevé |
| reading_year | INTEGER | Année |
| reading_month | INTEGER | Mois |
| meter_value | DECIMAL(10,2) | Valeur du compteur |
| previous_meter_value | DECIMAL(10,2) | Valeur précédente |
| consumption | DECIMAL(10,2) | Consommation |
| rate_per_unit | DECIMAL(10,2) | Tarif unitaire |
| amount_due | DECIMAL(10,2) | Montant dû |
| reading_type | ENUM | Actual, Estimated, Correction |
| reading_method | ENUM | Manual, Photo_OCR, Smart_Meter, Estimated |
| meter_photo_url | VARCHAR(500) | Photo du compteur |
| recorded_by_user_id | UUID | Utilisateur ayant enregistré |
| is_verified | BOOLEAN | Relevé vérifié |
| verified_by | UUID | Vérifié par |
| verified_at | TIMESTAMP | Date vérification |
| notes | TEXT | Notes |
| created_at | TIMESTAMP | Date d'enregistrement |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.10 Table : **recurring_payments** (Paiements automatiques)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| tenant_id | UUID | Référence au locataire |
| contract_id | UUID | Référence au contrat |
| payment_method | ENUM | Mobile_Money, Credit_Card |
| payment_provider | VARCHAR(100) | Fournisseur |
| mandate_reference | VARCHAR(200) | Référence mandat |
| recurring_amount | DECIMAL(10,2) | Montant récurrent |
| frequency | ENUM | Monthly, Quarterly, Yearly |
| start_date | DATE | Date début |
| end_date | DATE | Date fin |
| next_payment_date | DATE | Prochaine échéance |
| last_payment_date | DATE | Dernier paiement |
| status | ENUM | Active, Paused, Cancelled, Expired |
| total_payments_made | INTEGER | Nombre de paiements |
| is_active | BOOLEAN | Actif |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.11 Table : **notifications** (Notifications)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| recipient_type | ENUM | Landlord, Tenant, Admin |
| recipient_id | UUID | ID du destinataire |
| notification_type | ENUM | Payment_Due, Payment_Received, Payment_Overdue, Lease_Expiring, Maintenance_Request, Invoice_Generated, Contract_Signed |
| title | VARCHAR(200) | Titre |
| message | TEXT | Message |
| priority | ENUM | Low, Medium, High, Urgent |
| channel | ENUM | Email, SMS, WhatsApp, In_App, Push |
| status | ENUM | Pending, Sent, Delivered, Failed, Read |
| sent_at | TIMESTAMP | Date d'envoi |
| delivered_at | TIMESTAMP | Date de livraison |
| read_at | TIMESTAMP | Date de lecture |
| metadata | JSONB | Données additionnelles |
| retry_count | INTEGER | Nombre de tentatives |
| error_message | TEXT | Message d'erreur |
| created_at | TIMESTAMP | Date de création |

#### 3.1.12 Table : **notification_preferences** (Préférences de notifications)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| user_id | UUID | Référence utilisateur |
| user_type | ENUM | Landlord, Tenant |
| payment_due_email | BOOLEAN | Email échéance paiement |
| payment_due_sms | BOOLEAN | SMS échéance paiement |
| payment_due_whatsapp | BOOLEAN | WhatsApp échéance paiement |
| payment_due_days_before | INTEGER | Jours avant échéance |
| payment_received_email | BOOLEAN | Email paiement reçu |
| payment_received_sms | BOOLEAN | SMS paiement reçu |
| payment_overdue_email | BOOLEAN | Email retard |
| payment_overdue_sms | BOOLEAN | SMS retard |
| invoice_generated_email | BOOLEAN | Email facture générée |
| lease_expiring_email | BOOLEAN | Email contrat expire |
| lease_expiring_days_before | INTEGER | Jours avant expiration |
| maintenance_request_email | BOOLEAN | Email demande maintenance |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.13 Table : **maintenance_requests** (Demandes de maintenance)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| request_number | VARCHAR(100) | Numéro de demande |
| landlord_id | UUID | Référence au propriétaire |
| property_id | UUID | Référence à la propriété |
| unit_id | UUID | Référence à l'unité |
| tenant_id | UUID | Référence au locataire |
| contract_id | UUID | Référence au contrat |
| category | ENUM | Plumbing, Electrical, Heating, Appliance, Other |
| priority | ENUM | Low, Medium, High, Emergency |
| title | VARCHAR(200) | Titre |
| description | TEXT | Description détaillée |
| request_photos | JSONB | Photos du problème |
| status | ENUM | Submitted, Acknowledged, In_Progress, Resolved, Closed, Rejected |
| submitted_at | TIMESTAMP | Date soumission |
| acknowledged_at | TIMESTAMP | Date accusé réception |
| scheduled_date | DATE | Date intervention prévue |
| resolved_at | TIMESTAMP | Date résolution |
| assigned_to | VARCHAR(200) | Technicien assigné |
| estimated_cost | DECIMAL(10,2) | Coût estimé |
| actual_cost | DECIMAL(10,2) | Coût réel |
| cost_paid_by | ENUM | Landlord, Tenant, Split |
| tenant_responsibility_percentage | DECIMAL(5,2) | % à charge locataire |
| resolution_notes | TEXT | Notes résolution |
| resolution_photos | JSONB | Photos après réparation |
| tenant_rating | INTEGER | Note locataire (1-5) |
| tenant_feedback | TEXT | Commentaire locataire |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.14 Table : **documents** (Documents)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| document_type | ENUM | Contract, Invoice, Receipt, ID_Card, Proof_Of_Income, Property_Title, Insurance, Other |
| related_entity_type | ENUM | Landlord, Tenant, Property, Unit, Contract, Payment |
| related_entity_id | UUID | ID de l'entité liée |
| document_name | VARCHAR(200) | Nom du document |
| document_description | TEXT | Description |
| file_name | VARCHAR(200) | Nom du fichier |
| file_url | VARCHAR(500) | URL du fichier |
| file_size | BIGINT | Taille (bytes) |
| file_type | VARCHAR(50) | Type MIME |
| is_public | BOOLEAN | Document public |
| uploaded_by | UUID | Utilisateur qui a uploadé |
| uploaded_at | TIMESTAMP | Date d'upload |
| expires_at | TIMESTAMP | Date d'expiration |
| is_verified | BOOLEAN | Document vérifié |
| verified_by | UUID | Vérifié par |
| verified_at | TIMESTAMP | Date vérification |
| tags | JSONB | Tags |
| created_at | TIMESTAMP | Date de création |

#### 3.1.15 Table : **platform_subscriptions** (Abonnements plateforme)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| landlord_id | UUID | Référence au propriétaire |
| plan_name | ENUM | Basic, Pro, Enterprise, Custom |
| plan_price | DECIMAL(10,2) | Prix de l'abonnement |
| billing_cycle | ENUM | Monthly, Quarterly, Yearly |
| start_date | DATE | Date début |
| end_date | DATE | Date fin |
| auto_renew | BOOLEAN | Renouvellement auto |
| status | ENUM | Trial, Active, Suspended, Cancelled, Expired |
| trial_end_date | DATE | Fin période d'essai |
| max_properties | INTEGER | Nombre max de propriétés |
| max_units | INTEGER | Nombre max d'unités |
| features | JSONB | Fonctionnalités incluses |
| payment_method | VARCHAR(100) | Méthode de paiement |
| last_payment_date | DATE | Dernier paiement |
| next_payment_date | DATE | Prochain paiement |
| cancelled_at | TIMESTAMP | Date d'annulation |
| cancellation_reason | TEXT | Raison annulation |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

#### 3.1.16 Table : **platform_transactions** (Transactions plateforme)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| transaction_type | ENUM | Subscription_Fee, Commission, Refund, Adjustment |
| landlord_id | UUID | Référence au propriétaire |
| payment_id | UUID | Référence au paiement |
| amount | DECIMAL(10,2) | Montant |
| currency | VARCHAR(10) | Devise |
| description | TEXT | Description |
| transaction_date | DATE | Date transaction |
| status | ENUM | Pending, Completed, Failed |
| created_at | TIMESTAMP | Date de création |

#### 3.1.17 Table : **audit_logs** (Logs d'audit)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| user_id | UUID | Utilisateur |
| user_type | ENUM | Landlord, Tenant, Admin |
| action | VARCHAR(100) | Action effectuée |
| entity_type | VARCHAR(100) | Type d'entité |
| entity_id | UUID | ID de l'entité |
| old_values | JSONB | Anciennes valeurs |
| new_values | JSONB | Nouvelles valeurs |
| ip_address | VARCHAR(50) | Adresse IP |
| user_agent | TEXT | User agent |
| created_at | TIMESTAMP | Date de l'action |

#### 3.1.18 Table : **users** (Comptes utilisateurs système)
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| email | VARCHAR(200) | Email (unique) |
| phone | VARCHAR(20) | Téléphone |
| password_hash | VARCHAR(255) | Hash du mot de passe |
| user_type | ENUM | Landlord, Tenant, Admin |
| related_id | UUID | ID du landlord ou tenant |
| is_email_verified | BOOLEAN | Email vérifié |
| email_verification_token | VARCHAR(255) | Token vérification |
| is_phone_verified | BOOLEAN | Téléphone vérifié |
| phone_verification_code | VARCHAR(10) | Code vérification |
| two_factor_enabled | BOOLEAN | 2FA activé |
| two_factor_secret | VARCHAR(255) | Secret 2FA |
| profile_photo_url | VARCHAR(500) | Photo de profil |
| language | VARCHAR(10) | Langue (fr, en) |
| timezone | VARCHAR(50) | Fuseau horaire |
| last_login | TIMESTAMP | Dernière connexion |
| last_login_ip | VARCHAR(50) | IP dernière connexion |
| login_count | INTEGER | Nombre de connexions |
| is_active | BOOLEAN | Compte actif |
| is_suspended | BOOLEAN | Compte suspendu |
| suspension_reason | TEXT | Raison suspension |
| password_reset_token | VARCHAR(255) | Token reset password |
| password_reset_expires | TIMESTAMP | Expiration token |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Date de mise à jour |

---

## 4. FONCTIONNALITÉS DÉTAILLÉES

### 4.1 MODULE AUTHENTIFICATION ET COMPTES

#### 4.1.1 Inscription
**Pour les propriétaires :**
- Formulaire d'inscription avec email et téléphone
- Vérification email (lien de confirmation)
- Vérification téléphone (code SMS)
- Choix du plan d'abonnement (trial 30 jours gratuit)
- Upload documents de vérification (facultatif)
- Création du profil propriétaire

**Pour les locataires :**
- Inscription simplifiée (email/téléphone)
- Vérification email et téléphone
- Profil minimal initial
- Complétion du profil lors de la signature du contrat

#### 4.1.2 Connexion
- Email + mot de passe
- Connexion par téléphone + OTP
- Option "Se souvenir de moi"
- Double authentification (2FA) optionnelle
- Connexion sociale (Google, Facebook - optionnel)

#### 4.1.3 Gestion du profil
- Modification des informations personnelles
- Changement de mot de passe
- Upload photo de profil
- Préférences de notifications
- Préférences de langue
- Gestion 2FA

### 4.2 MODULE PROPRIÉTAIRE (LANDLORD PORTAL)

#### 4.2.1 Tableau de bord propriétaire
**Vue d'ensemble :**
- Revenus du mois en cours
- Total des impayés
- Taux d'occupation global
- Prochaines échéances
- Alertes importantes
- Graphiques (revenus 12 derniers mois, occupation, impayés)

**Raccourcis :**
- Ajouter une propriété
- Enregistrer un relevé
- Consulter les paiements du jour
- Voir les demandes de maintenance

#### 4.2.2 Gestion des propriétés
**Lister les propriétés :**
- Vue liste ou grille avec photos
- Filtres (ville, type, statut, occupation)
- Recherche par nom
- Tri personnalisable
- Export Excel/PDF

**Créer/Modifier une propriété :**
- Formulaire complet avec validation
- Upload photos (galerie)
- Marqueur GPS sur carte
- Documents associés
- Configuration des équipements
- Historique des modifications

**Détails d'une propriété :**
- Informations complètes
- Liste des unités avec statuts
- Revenus générés (total, mensuel, annuel)
- Taux d'occupation historique
- Graphiques de performance
- Liste des locataires actuels
- Historique des contrats

#### 4.2.3 Gestion des unités locatives
**Lister les unités :**
- Toutes les unités ou par propriété
- Filtres (disponible, occupée, type)
- Vue détaillée par unité

**Créer/Modifier une unité :**
- Formulaire avec tous les détails
- Photos de l'unité
- Définition du loyer
- Configuration compteurs
- Équipements et meubles
- Conditions spéciales

**Détails d'une unité :**
- Informations complètes
- Locataire actuel
- Historique des locations
- Revenus générés
- Historique des relevés
- Demandes de maintenance

#### 4.2.4 Gestion des locataires
**Liste des locataires :**
- Tous les locataires (actuels et anciens)
- Filtres (actifs, inactifs, en retard)
- Statut de paiement
- Recherche

**Profil du locataire :**
- Informations complètes
- Historique des contrats
- Historique des paiements
- Relevés de compteurs
- Demandes de maintenance
- Documents uploadés
- Notes privées

**Inviter un locataire :**
- Envoyer invitation par email/SMS
- Le locataire crée son compte
- Association automatique

#### 4.2.5 Gestion des contrats
**Liste des contrats :**
- Tous les contrats (en cours, expirés, résiliés)
- Filtres et recherche
- Alertes contrats expirant bientôt

**Créer un contrat :**
- Sélection propriété et unité
- Sélection ou invitation locataire
- Définition des termes (loyer, caution, charges)
- Configuration relevés de compteurs
- Clauses spéciales
- Génération PDF automatique
- Signature électronique

**Gérer un contrat :**
- Voir détails complets
- Modifier (si non signé)
- Renouveler
- Résilier (avec motif)
- Télécharger PDF
- Historique des modifications

#### 4.2.6 Facturation
**Génération automatique :**
- Factures de loyer générées automatiquement le 1er du mois
- Inclusion automatique des charges si relevés saisis
- Envoi automatique par email au locataire
- Notifications de rappel configurables

**Factures manuelles :**
- Créer facture ponctuelle (réparations, charges diverses)
- Modifier facture avant envoi
- Annuler facture

**Liste des factures :**
- Toutes les factures avec statuts
- Filtres (payées, impayées, en retard)
- Recherche par locataire, période, montant
- Export Excel/PDF

**Détails d'une facture :**
- Informations complètes
- Décomposition des charges
- Historique des paiements
- Solde restant
- Télécharger PDF
- Renvoyer au locataire

#### 4.2.7 Relevés de compteurs
**Saisie des relevés :**
- Formulaire simplifié par unité
- Saisie en masse pour toutes les unités
- Upload photo du compteur
- OCR automatique (optionnel)
- Validation et alertes anomalies

**Historique des relevés :**
- Par unité ou global
- Graphiques de consommation
- Comparaisons mensuelles
- Détection des pics

#### 4.2.8 Paiements reçus
**Liste des paiements :**
- Tous les paiements reçus
- Filtres (méthode, statut, période)
- Recherche

**Détails d'un paiement :**
- Informations complètes
- Factures payées
- Reçu téléchargeable
- Affectation aux factures

**Paiements hors ligne :**
- Enregistrer paiement espèces
- Enregistrer virement reçu
- Upload preuve de paiement
- Génération reçu manuel

#### 4.2.9 Rapports et statistiques
**Rapports financiers :**
- État des revenus (mensuel, annuel)
- État des impayés détaillé
- Prévisionnel de revenus
- Analyse par propriété
- Analyse par type de charge
- Export comptable

**Rapports opérationnels :**
- Taux d'occupation par période
- Durée moyenne de location
- Turnover des locataires
- Performance par propriété
- Maintenance par type

**Graphiques :**
- Évolution des revenus
- Répartition loyers vs charges
- Top 10 locataires ponctuels
- Impayés par propriété

#### 4.2.10 Maintenance
**Liste des demandes :**
- Toutes les demandes
- Filtres (priorité, statut, type)
- Assignation technicien

**Traiter une demande :**
- Accuser réception
- Planifier intervention
- Mise à jour du statut
- Upload photos réparation
- Saisie des coûts
- Clôture

### 4.3 MODULE LOCATAIRE (TENANT PORTAL)

#### 4.3.1 Tableau de bord locataire
**Vue d'ensemble :**
- Prochaine échéance de paiement
- Solde dû total
- Mes locations (liste)
- Historique des paiements (derniers)
- Demandes de maintenance en cours
- Notifications importantes

**Actions rapides :**
- Payer maintenant
- Voir mes factures
- Nouvelle demande de maintenance
- Télécharger quittance

#### 4.3.2 Mes locations
**Liste de mes locations :**
- Toutes les locations (actuelles et passées)
- Informations par location (adresse, loyer, début)
- Statut du contrat

**Détails d'une location :**
- Informations complètes du logement
- Détails du contrat
- Contact propriétaire
- Télécharger le contrat PDF
- Photos du logement
- Équipements

#### 4.3.3 Mes factures
**Liste des factures :**
- Toutes mes factures
- Filtres (payées, impayées, période)
- Statut de paiement clair

**Détails d'une facture :**
- Décomposition détaillée
- Loyer + charges
- Date d'échéance
- Montant dû
- Télécharger PDF
- **Bouton "Payer maintenant"**

#### 4.3.4 Paiements en ligne
**Méthodes de paiement :**
- Mobile Money (TMoney, Flooz, Moov, Orange)
- Carte bancaire (Stripe)
- Prélèvement automatique (setup)

**Processus de paiement :**
1. Sélection de la facture à payer
2. Choix de la méthode
3. Saisie des informations
4. Confirmation et validation
5. Redirection vers le fournisseur
6. Callback et mise à jour du statut
7. Génération reçu automatique
8. Notification propriétaire

**Paiements automatiques :**
- Configuration prélèvement récurrent
- Choix de la date
- Gestion du mandat
- Pause/Annulation

#### 4.3.5 Mes paiements
**Historique complet :**
- Tous les paiements effectués
- Méthode utilisée
- Factures payées
- Télécharger reçus

#### 4.3.6 Relevés de compteurs
**Consulter mes relevés :**
- Historique des relevés (électricité, eau)
- Graphiques de consommation
- Comparaison mois par mois
- Conseils d'économie (optionnel)

**Soumettre un relevé :**
- Upload photo du compteur (si autorisé)
- Validation par propriétaire

#### 4.3.7 Demandes de maintenance
**Créer une demande :**
- Formulaire simple
- Catégorie et priorité
- Description détaillée
- Upload photos du problème
- Soumission

**Suivre mes demandes :**
- Liste de toutes mes demandes
- Statut en temps réel
- Historique des actions
- Notification à chaque étape
- Noter la réparation

#### 4.3.8 Documents
**Mes documents :**
- Contrats de location
- Quittances de loyer
- Reçus de paiement
- État des lieux (entrée/sortie)
- Téléchargement facile

#### 4.3.9 Notifications
**Centre de notifications :**
- Toutes les notifications
- Marquer comme lu
- Préférences (email, SMS, in-app)

### 4.4 MODULE PAIEMENTS EN LIGNE (PAYMENT GATEWAY)

#### 4.4.1 Intégrations Payment Providers

**TMoney (Togo) :**
- API REST officielle
- Flow : Initiate → Check Status → Callback
- Webhooks pour confirmations
- Gestion des erreurs et timeouts

**Flooz (Togo) :**
- API USSD ou REST
- Flow similaire à TMoney
- Réconciliation automatique

**Moov Money (multi-pays) :**
- API REST
- Support multi-devises

**Orange Money :**
- API Orange Money
- Intégration selon disponibilité

**Wave :**
- API Wave si disponible
- Alternative : QR code

**Stripe (cartes internationales) :**
- Stripe Checkout
- Payment Intents API
- 3D Secure
- Gestion abonnements récurrents

#### 4.4.2 Processus de paiement unifié
```
1. Locataire clique "Payer"
2. Sélection méthode
3. Création transaction en base (status: pending)
4. Redirection vers provider
5. Locataire effectue paiement
6. Callback du provider (webhook)
7. Vérification signature
8. Mise à jour transaction (status: completed)
9. Affectation aux factures
10. Envoi notifications (locataire + propriétaire)
11. Génération reçu PDF
12. Calcul commission plateforme
```

#### 4.4.3 Sécurité des paiements
- HTTPS obligatoire
- Tokens uniques par transaction
- Vérification signatures webhooks
- Logs complets de toutes les transactions
- Double vérification statut (polling + webhook)
- Gestion idempotence
- Délai maximum de transaction (15 min)

#### 4.4.4 Réconciliation
- Job automatique quotidien
- Vérification des paiements "pending" > 24h
- Requête API pour vérifier statut
- Mise à jour automatique
- Alertes en cas d'anomalie

#### 4.4.5 Remboursements
- Interface admin pour initier remboursement
- Workflow d'approbation
- Appel API provider pour remboursement
- Mise à jour comptabilité
- Notification du locataire

### 4.5 MODULE NOTIFICATIONS ET RAPPELS

#### 4.5.1 Types de notifications

**Pour les propriétaires :**
- Paiement reçu
- Nouveau locataire
- Contrat signé
- Demande de maintenance
- Facture impayée X jours
- Contrat expirant dans Y jours
- Alerte consommation anormale

**Pour les locataires :**
- Facture générée
- Rappel paiement (X jours avant échéance)
- Paiement en retard (après échéance)
- Paiement confirmé
- Demande de maintenance mise à jour
- Contrat expirant
- Nouveau relevé de compteur

#### 4.5.2 Système de rappels automatiques
**Configuration par défaut :**
- J-7 : Premier rappel paiement
- J-3 : Deuxième rappel
- J-1 : Dernier rappel avant échéance
- J+1 : Alerte retard
- J+7 : Alerte retard sérieux
- J+15 : Alerte retard critique

**Personnalisation :**
- Le propriétaire peut configurer les délais
- Activation/désactivation par type
- Templates de messages personnalisables

#### 4.5.3 Multi-canal
- **Email** : Pour messages détaillés
- **SMS** : Pour alertes urgentes
- **WhatsApp** : Messages riches (PDF, images)
- **In-app** : Notifications push
- **Push mobile** : Si app mobile développée

#### 4.5.4 Queue de notifications
- Job asynchrone (Bull + Redis)
- Traitement en batch
- Retry automatique en cas d'échec
- Logs détaillés

### 4.6 MODULE RAPPORTS ET ANALYTICS

#### 4.6.1 Dashboard Analytics (Propriétaire)
**KPIs principaux :**
- Revenus totaux (MTD, YTD)
- Taux de collection (% paiements à l'heure)
- Taux d'occupation moyen
- Nombre de locataires actifs
- Impayés totaux
- Valeur moyenne du loyer

**Graphiques :**
- Évolution revenus (12 mois)
- Répartition revenus (loyer vs charges)
- Top 5 propriétés par revenu
- Impayés par mois
- Taux d'occupation temporel
- Distribution géographique

#### 4.6.2 Rapports financiers
- État des revenus mensuels
- État des impayés détaillé
- Prévisionnel de trésorerie
- Analyse par propriété
- Analyse par locataire
- Export comptable (CSV, Excel)

#### 4.6.3 Rapports opérationnels
- Taux d'occupation détaillé
- Durée moyenne de location
- Turnover (entrées/sorties)
- Délai moyen de paiement
- Demandes de maintenance (volume, temps résolution)

#### 4.6.4 Export et partage
- PDF professionnel
- Excel avec graphiques
- CSV pour traitement externe
- Envoi par email
- Planification automatique (rapports mensuels)

### 4.7 MODULE ADMINISTRATION (ADMIN PANEL)

#### 4.7.1 Gestion des utilisateurs
- Liste tous les propriétaires
- Liste tous les locataires
- Activation/Désactivation comptes
- Réinitialisation mots de passe
- Vérification manuelle documents
- Support utilisateurs

#### 4.7.2 Gestion des abonnements
- Liste des abonnements actifs
- Renouvellements
- Suspensions
- Remboursements
- Statistiques d'abonnements

#### 4.7.3 Gestion des transactions
- Liste toutes les transactions
- Filtres avancés
- Réconciliation manuelle
- Remboursements
- Litiges

#### 4.7.4 Configuration plateforme
- Plans d'abonnement (prix, features)
- Taux de commission
- Providers de paiement (activation/config)
- Templates de notifications
- Paramètres généraux

#### 4.7.5 Monitoring
- Dashboard système (uptime, performance)
- Logs d'erreurs
- Statistiques d'utilisation
- Alertes système

#### 4.7.6 Support
- Tickets support
- Chat en direct
- Base de connaissances

---

## 5. RÈGLES DE GESTION MÉTIER

### 5.1 Règles de facturation

#### 5.1.1 Génération automatique
- Facture de loyer générée automatiquement le 1er de chaque mois
- Date d'échéance : Jour du mois défini dans le contrat (par défaut : 5)
- Inclusion des charges si relevés saisis avant génération
- Si pas de relevé : estimation basée sur moyenne 3 derniers mois

#### 5.1.2 Calculs
```
Loyer de base = Montant défini dans le contrat
Charge électricité = (Relevé actuel - Relevé précédent) × Tarif
Charge eau = (Relevé actuel - Relevé précédent) × Tarif
Autres charges = Montant forfaitaire défini

Sous-total = Loyer + Charges
TVA = Sous-total × Taux (si applicable)
Total = Sous-total + TVA
```

#### 5.1.3 Pénalités de retard
- Calculées automatiquement après le délai de grâce
- Formule : `Montant dû × Taux de pénalité × (Jours de retard / 30)`
- Ajoutées à la facture suivante ou facture séparée

### 5.2 Règles de paiement

#### 5.2.1 Affectation automatique
- Paiement affecté d'abord aux factures les plus anciennes
- Ordre : Pénalités de retard → Facture principale
- Si paiement partiel : Répartition proportionnelle
- Si trop-perçu : Crédit pour factures futures

#### 5.2.2 Paiement en ligne
- Confirmation immédiate (in-app)
- Webhook de validation (max 5 min)
- Si timeout : Vérification manuelle par job
- Remboursement automatique si échec après débit

#### 5.2.3 Paiements hors ligne
- Enregistrés manuellement par propriétaire
- Validation avec upload preuve (optionnel)
- Génération reçu manuel

### 5.3 Règles de contrat

#### 5.3.1 Création
- Un seul contrat actif par unité
- Caution = 1 à 3 mois de loyer (configurable)
- Relevés initiaux obligatoires
- Signature électronique optionnelle

#### 5.3.2 Renouvellement
- Alerte 60 jours avant expiration
- Renouvellement automatique si activé dans contrat
- Possibilité de modifier les termes lors du renouvellement

#### 5.3.3 Résiliation
- Préavis respecté (défini dans contrat)
- Relevés finaux obligatoires
- Calcul prorata si départ en cours de mois
- Retenue sur caution si impayés ou dégâts
- Remboursement caution sous 30 jours

### 5.4 Règles de notifications

#### 5.4.1 Fréquence
- Maximum 1 rappel de paiement par jour
- Respect des préférences utilisateur
- Pause notifications si paiement en cours

#### 5.4.2 Priorités
- Urgent : SMS + Email + In-app
- Haute : Email + In-app
- Normale : Email ou In-app
- Basse : In-app seulement

### 5.5 Règles de sécurité

#### 5.5.1 Données sensibles
- Cryptage AES-256 pour :
  - Numéros de cartes bancaires
  - IBAN
  - Documents d'identité
  - Données bancaires

#### 5.5.2 Accès
- Isolation complète des données entre propriétaires
- Locataire accède uniquement à ses locations
- Admin accède à tout mais logs complets

#### 5.5.3 Conformité
- RGPD (si applicable)
- PCI-DSS pour paiements cartes
- Droit à l'oubli
- Export des données personnelles

---

## 6. MODÈLE D'AFFAIRES (BUSINESS MODEL)

### 6.1 Revenus de la plateforme

#### 6.1.1 Abonnements propriétaires
**Plan Basic (Gratuit - Trial 30j puis Limité) :**
- 1 propriété
- 5 unités max
- Fonctionnalités de base
- Support email
- **Gratuit** ou **5 000 FCFA/mois après trial**

**Plan Pro (15 000 FCFA/mois) :**
- 3 propriétés
- 30 unités max
- Toutes fonctionnalités
- Rapports avancés
- Support prioritaire

**Plan Enterprise (30 000 FCFA/mois) :**
- Propriétés illimitées
- Unités illimitées
- API access
- Support dédié
- Personnalisation

**Plan Custom :**
- Sur devis pour grandes agences
- Features sur mesure

#### 6.1.2 Commissions sur paiements
- **2% de commission** sur chaque paiement en ligne via la plateforme
- Calculée automatiquement et déduite
- Propriétaire reçoit le net
- Minimum : 100 FCFA par transaction

**Exemple :**
```
Loyer payé : 50 000 FCFA
Commission plateforme (2%) : 1 000 FCFA
Frais provider (1.5%) : 750 FCFA
Propriétaire reçoit : 48 250 FCFA
```

#### 6.1.3 Services additionnels (optionnels)
- Signature électronique avancée : 1 000 FCFA/contrat
- OCR relevés de compteurs : Inclus Pro, 50 FCFA/relevé Basic
- SMS premium (au-delà de quota) : 25 FCFA/SMS
- Génération état des lieux : 2 000 FCFA
- Service de recouvrement : 10% du montant récupéré

### 6.2 Projections financières (exemple)

**Hypothèses :**
- 100 propriétaires à 6 mois
- 500 propriétaires à 1 an
- 2000 propriétaires à 2 ans
- Loyer moyen : 40 000 FCFA
- 70% sur plan Pro

**Revenus mensuels (Année 1) :**
- Abonnements : 500 × (70% × 15K + 30% × 5K) = 6,000,000 FCFA
- Commissions : 500 propriétaires × 20 unités × 70% occupé × 40K × 2% = 5,600,000 FCFA
- **Total mensuel : 11,600,000 FCFA** (~ 17 700 €/mois)
- **Total annuel : ~140M FCFA** (~ 213 000 €/an)

---

## 7. ROADMAP DE DÉVELOPPEMENT

### 7.1 Phase 1 : MVP (3-4 mois)

**Mois 1-2 : Core Backend & Database**
- Architecture base de données complète
- API REST (auth, CRUD de base)
- Authentification JWT
- Gestion propriétés et unités
- Gestion locataires
- Gestion contrats

**Mois 2-3 : Core Features**
- Facturation automatique
- Enregistrement paiements manuels
- Dashboard propriétaire de base
- Dashboard locataire de base
- Notifications email basiques
- Documents et upload

**Mois 3-4 : Paiements en ligne & Polish**
- Intégration TMoney
- Intégration Flooz
- Intégration Stripe (cartes)
- Processus paiement complet
- Webhooks et réconciliation
- Tests et déploiement MVP

**Livrables Phase 1 :**
- ✅ Inscription propriétaires et locataires
- ✅ Gestion complète propriétés/unités/contrats
- ✅ Facturation automatique loyers
- ✅ Paiements en ligne (Mobile Money + Cartes)
- ✅ Dashboards basiques
- ✅ Notifications email

### 7.2 Phase 2 : Features Avancées (2-3 mois)

**Mois 5 : Relevés et charges**
- Gestion relevés compteurs
- Calculs charges automatiques
- OCR photos compteurs (basique)
- Alertes consommation anormale

**Mois 6 : Notifications et rappels**
- Système de rappels automatiques
- Intégration SMS (Twilio/Africa's Talking)
- Intégration WhatsApp Business
- Préférences de notifications

**Mois 6-7 : Rapports et maintenance**
- Rapports financiers avancés
- Analytics et graphiques
- Demandes de maintenance
- Workflow maintenance

**Livrables Phase 2 :**
- ✅ Gestion charges (électricité, eau)
- ✅ Notifications multi-canaux
- ✅ Rappels automatiques
- ✅ Rapports avancés
- ✅ Maintenance requests

### 7.3 Phase 3 : Optimisations & Scale (2 mois)

**Mois 8 : Performance et UX**
- Optimisation requêtes DB
- Caching avec Redis
- Amélioration UI/UX
- Mobile responsive parfait
- Tests de charge

**Mois 9 : Admin et Business**
- Admin panel complet
- Gestion abonnements
- Système de billing plateforme
- Analytics plateforme
- Support système

**Livrables Phase 3 :**
- ✅ Performance optimale
- ✅ Admin panel
- ✅ Gestion abonnements
- ✅ Système prêt pour scale

### 7.4 Phase 4 : Extensions (futures)

**Post-lancement :**
- Application mobile native (React Native)
- Signature électronique avancée
- OCR intelligent
- Chatbot support
- Intégration comptabilité
- Marketplace services (assurances, déménagement)
- Programme de parrainage
- API publique pour partenaires

---

## 8. SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES

### 8.1 Architecture API REST

#### 8.1.1 Structure des endpoints
```
/api/v1
  /auth
    POST /register (landlord/tenant)
    POST /login
    POST /logout
    POST /refresh-token
    POST /forgot-password
    POST /reset-password
    POST /verify-email
    POST /verify-phone
    
  /landlords
    GET /me
    PUT /me
    GET /me/properties
    GET /me/units
    GET /me/tenants
    GET /me/contracts
    GET /me/invoices
    GET /me/payments
    GET /me/dashboard
    GET /me/reports
    
  /tenants
    GET /me
    PUT /me
    GET /me/contracts
    GET /me/invoices
    GET /me/payments
    GET /me/dashboard
    
  /properties
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
    
  /units
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
    
  /contracts
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
    POST /:id/sign
    POST /:id/renew
    POST /:id/terminate
    
  /invoices
    GET /
    POST /
    GET /:id
    PUT /:id
    POST /:id/send
    DELETE /:id
    GET /:id/pdf
    
  /payments
    GET /
    POST /
    GET /:id
    POST /initiate
    POST /callback/:provider
    GET /:id/receipt
    
  /meter-readings
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
    
  /maintenance
    GET /
    POST /
    GET /:id
    PUT /:id
    
  /notifications
    GET /
    GET /:id
    PUT /:id/read
    
  /documents
    POST /upload
    GET /:id
    DELETE /:id
    
  /admin
    GET /users
    GET /transactions
    GET /subscriptions
    PUT /users/:id/status
    GET /analytics
```

#### 8.1.2 Authentification
- Bearer Token JWT dans header : `Authorization: Bearer <token>`
- Access token valide 1h
- Refresh token valide 30 jours
- Rotation des refresh tokens

#### 8.1.3 Réponses API standard
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 8.2 Base de données

#### 8.2.1 Indexation
- Index sur tous les foreign keys
- Index composite sur (landlord_id, created_at) pour queries fréquentes
- Index sur statuts (invoice_status, payment_status, etc.)
- Index JSONB avec GIN pour metadata

#### 8.2.2 Partitionnement (si scale important)
- Partitionnement de `audit_logs` par mois
- Partitionnement de `notifications` par mois
- Archive des anciennes données (> 2 ans)

#### 8.2.3 Backups
- Backup complet quotidien (3h du matin)
- Backup incrémental toutes les 6h
- Rétention 30 jours
- Test de restauration mensuel

### 8.3 Sécurité

#### 8.3.1 HTTPS
- Certificat SSL/TLS (Let's Encrypt)
- HSTS activé
- Redirection HTTP → HTTPS

#### 8.3.2 Rate limiting
- 100 requêtes/minute par IP pour API publique
- 1000 requêtes/minute pour utilisateurs authentifiés
- 10 tentatives de login/heure par IP

#### 8.3.3 Validation
- Validation côté serveur avec Joi/Zod
- Sanitization des inputs
- Protection CSRF
- Protection XSS

#### 8.3.4 Secrets
- Variables d'environnement
- Pas de secrets en code
- Rotation des secrets tous les 90 jours

### 8.4 Monitoring et Logs

#### 8.4.1 Logging
- Winston pour logs applicatifs
- Niveaux : error, warn, info, debug
- Logs structurés en JSON
- Centralisation avec CloudWatch/Datadog

#### 8.4.2 Monitoring
- Uptime monitoring (UptimeRobot)
- APM (Application Performance Monitoring)
- Alertes sur erreurs critiques
- Dashboard temps réel

#### 8.4.3 Métriques
- Nombre de requêtes/seconde
- Temps de réponse moyen
- Taux d'erreur
- Utilisation CPU/RAM/Disk
- Nombre d'utilisateurs actifs

---

## 9. DÉPLOIEMENT ET INFRASTRUCTURE

### 9.1 Architecture d'hébergement

#### Option A : Cloud VPS (Recommandé pour démarrage)
```
- VPS DigitalOcean/Contabo/Hetzner
- 4 CPU, 8GB RAM, 160GB SSD
- Ubuntu 22.04 LTS
- Nginx reverse proxy
- Node.js avec PM2
- PostgreSQL 14
- Redis
- Coût : ~30-50 USD/mois
```

#### Option B : Cloud managé (Scale)
```
- AWS/GCP/Azure
- EC2 instances (auto-scaling)
- RDS PostgreSQL (managed)
- ElastiCache Redis
- S3 storage
- CloudFront CDN
- Load balancer
- Coût : ~200-500 USD/mois
```

### 9.2 CI/CD Pipeline
```
GitHub → GitHub Actions → Docker build → Tests → Deploy
```

**Étapes :**
1. Push code sur GitHub
2. GitHub Actions trigger
3. Run tests (unit, integration)
4. Build Docker image
5. Push to registry
6. Deploy to staging
7. Tests E2E
8. Deploy to production (si manuel)

### 9.3 Environnements
- **Development** : Local
- **Staging** : Serveur de test (mirror production)
- **Production** : Serveur live

### 9.4 Monitoring production
- Sentry pour tracking erreurs
- Datadog/New Relic pour APM
- Alertes Slack/Email sur incidents
- Status page public

---

## 10. BUDGET ESTIMATIF

### 10.1 Développement

**Phase 1 (MVP) :**
- Backend API : 200h × Taux horaire
- Frontend Web : 180h × Taux horaire
- Intégrations paiements : 60h × Taux horaire
- Tests et déploiement : 40h × Taux horaire
- **Total Phase 1 : 480h**

**Phase 2 (Advanced) :**
- Features avancées : 150h
- **Total Phase 2 : 150h**

**Phase 3 (Polish) :**
- Optimisations : 100h
- **Total Phase 3 : 100h**

**TOTAL DÉVELOPPEMENT : 730 heures**

### 10.2 Infrastructure (mensuel)

**Démarrage (0-6 mois) :**
- VPS : 30 USD
- Domaine : 1 USD
- SSL : Gratuit
- Email (SendGrid) : 15 USD
- SMS (Twilio) : 20 USD
- Storage (S3) : 5 USD
- Monitoring : 10 USD
- **Total : ~80 USD/mois**

**Scale (6-12 mois) :**
- Cloud managé : 200 USD
- Services : 100 USD
- **Total : ~300 USD/mois**

### 10.3 Coûts récurrents
- Maintenance : 20h/mois
- Support : Variable
- Marketing : Budget séparé

---

## 11. RISQUES ET MITIGATION

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Échec intégration paiement | Élevé | Moyen | Tests exhaustifs, fallback manuel |
| Perte de données | Critique | Faible | Backups quotidiens, réplication |
| Attaque sécurité | Élevé | Moyen | Audits réguliers, WAF, monitoring |
| Adoption faible | Critique | Moyen | Marketing, période trial, support |
| Problèmes de scale | Moyen | Moyen | Architecture scalable, monitoring |
| Non-conformité légale | Élevé | Faible | Consultation juridique, RGPD |
| Indisponibilité provider | Moyen | Moyen | Multi-providers, cache |

---

## 12. CRITÈRES DE SUCCÈS

### 12.1 KPIs Techniques
- ✅ Uptime > 99.5%
- ✅ Temps de réponse API < 300ms (p95)
- ✅ Taux d'erreur < 0.1%
- ✅ Couverture tests > 80%

### 12.2 KPIs Business (6 mois)
- ✅ 100+ propriétaires inscrits
- ✅ 1000+ unités gérées
- ✅ 500+ paiements en ligne/mois
- ✅ Taux conversion trial → payant > 40%
- ✅ Taux de rétention > 85%
- ✅ NPS > 50

### 12.3 KPIs Utilisateurs
- ✅ Satisfaction propriétaires > 4.5/5
- ✅ Satisfaction locataires > 4.5/5
- ✅ Taux paiement à temps > 80%
- ✅ Temps moyen génération facture < 2 min

---

## 13. DOCUMENTATION LIVRABLES

### 13.1 Documentation technique
- Architecture système détaillée
- Documentation API (Swagger/OpenAPI)
- Schéma base de données (ERD)
- Guide d'installation
- Guide de déploiement
- Runbook opérationnel

### 13.2 Documentation utilisateur
- Guide propriétaire (PDF + vidéos)
- Guide locataire (PDF + vidéos)
- FAQ complète
- Tutoriels pas-à-pas

### 13.3 Documentation admin
- Guide administrateur
- Procédures de support
- Gestion des incidents

---

## 14. SUPPORT ET MAINTENANCE

### 14.1 Support utilisateurs
- **Email** : support@plateforme.com (48h)
- **In-app chat** : Heures ouvrables
- **Base de connaissances** : 24/7
- **Vidéos tutoriels** : YouTube

### 14.2 Maintenance
- **Corrective** : Bugs critiques < 24h
- **Évolutive** : Features selon roadmap
- **Préventive** : Monitoring continu
- **Mises à jour** : Mensuelles

### 14.3 SLA (Service Level Agreement)
- Disponibilité : 99.5%
- Support critique : < 4h
- Support normal : < 24h
- Temps résolution bug critique : < 48h

---

## CONCLUSION

Ce cahier des charges définit une **plateforme SaaS complète et moderne** pour la gestion locative en Afrique. Le système proposé transforme complètement l'expérience propriétaire-locataire en :

✅ **Digitalisant** tous les processus (contrats, facturation, paiements)  
✅ **Automatisant** les tâches répétitives (factures, rappels)  
✅ **Facilitant** les paiements en ligne (Mobile Money + Cartes)  
✅ **Centralisant** toute la gestion dans un espace unique  
✅ **Fournissant** des analytics et rapports détaillés  
✅ **Améliorant** la relation propriétaire-locataire  

**Différenciateurs clés :**
- 🎯 Adapté au marché africain (Mobile Money first)
- 🎯 Multi-tenant avec isolation complète des données
- 🎯 Paiements en ligne intégrés nativement
- 🎯 Espaces dédiés propriétaires ET locataires
- 🎯 Notifications automatiques intelligentes
- 🎯 Modèle d'affaires viable (abonnements + commissions)

**Prochaines étapes :**
1. ✅ Validation du cahier des charges
2. Wireframes et mockups UI/UX
3. Architecture technique détaillée
4. Setup environnement de développement
5. Sprint 1 : Auth + Database + API Core

---

**Document** : Cahier des Charges v2.0  
**Date** : 02 février 2026  
**Client** : TAD IT CONSULTING  
**Projet** : Plateforme SaaS Gestion Locative  
**Pages** : 60+

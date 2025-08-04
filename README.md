# azure-func-email-sender
## Structure
                  ┌────────────────────────┐
                  │   App Function 1       | 
                  |   (checkPendingStatus) │
                  └────────────┬───────────┘
                               │
            (1) Send message to Service Bus Queue/Topic
                               │
                    ┌──────────▼────────┐
                    │   Azure Service   │
                    │     Bus Queue     │
                    └──────────┬────────┘
                               │
           (2) Automatically triggers Function when message arrives
                              │
                ┌─────────────▼──────────┐
                │  Azure Function App 2  │
                │  - Parses message      │
                │  - Sends email         │
                └────────────┬───────────┘
                             │
                       (3) Send email
                             │
            ┌────────────────▼───────────────────┐
            │ Azure Communitation Service Email  │
            └────────────────────────────────────┘
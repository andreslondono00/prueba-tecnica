import { Routes } from '@angular/router';

import { TicketListComponent } from './pages/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './pages/tickets/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './pages/tickets/ticket-form/ticket-form.component';
import { ClientListComponent } from './pages/clients/client-list/client-list.component';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { ClientFormComponent } from './pages/clients/client-form/client-form.component';
import { AgentListComponent } from './pages/agents/agent-list/agent-list.component';
import { AgentDetailComponent } from './pages/agents/agent-detail/agent-detail.component';

export const routes: Routes = [
    // Tickets
    { path: 'tickets', component: TicketListComponent },
    { path: 'tickets/new', component: TicketFormComponent },
    { path: 'tickets/:id', component: TicketDetailComponent },

    // Clients
    { path: 'clients', component: ClientListComponent },
    { path: 'clients/new', component: ClientFormComponent },
    { path: 'clients/:id', component: ClientDetailComponent },

    // Agents
    { path: 'agents', component: AgentListComponent },
    { path: 'agents/:id', component: AgentDetailComponent },

    // Default route
    { path: '', redirectTo: '/tickets', pathMatch: 'full' },

    // 404 handler
    { path: '**', redirectTo: '/tickets' }
];

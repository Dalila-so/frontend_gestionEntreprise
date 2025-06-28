/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardData {
  ordersPerMonth: any;
  totalClients: number;
  ordersToday: number;
  revenue: number;
}

export @Injectable({
  providedIn: 'root'
})

class DashboardService {
  //private apiUrl = 'http://localhost:8080/api/dashboard'; // adjust to your backend

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface DashboardData {
  totalClients: number;
  ordersToday: number;
  revenue: number;
  ordersPerMonth: { month: string; count: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor() {}

  getDashboardData(): Observable<DashboardData> {
    // Mock data for demo purposes
    const data: DashboardData = {
      totalClients: 123,
      ordersToday: 15,
      revenue: 54321,
      ordersPerMonth: [
        { month: 'Jan', count: 10 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 12 },
        { month: 'Apr', count: 20 },
        { month: 'May', count: 25 },
        { month: 'Jun', count: 18 },
      ],
    };

    // Return mock data as an observable
    return of(data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { Console } from 'console';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/api/Auth`;
  user?: User;

  constructor(private http: HttpClient) {}
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  login(data: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data)
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  

  register(data: { username: string; password: string; }) {
  return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
}


  logout() {
    localStorage.removeItem('token');
  }

  get token() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, this.getAuthHeaders());
  }

  //  registerWithImage(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/register`, formData);
  // }

  registerWithImage(formData: FormData): Observable<string> {
  return this.http.post(`${this.baseUrl}/register`, formData, {
    responseType: 'text'
  });
}

// auth.service.ts
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/users`, this.getAuthHeaders());
}


// updateProfile(formData: FormData) {
//   return this.http.put(`${this.baseUrl}/update`, formData, this.getAuthHeaders());
// }

updateProfile(formData: FormData) {
  return this.http.put<User>(
    `${this.baseUrl}/update`,
    formData,
    this.getAuthHeaders()   // ✅ attach bearer token
  );
}


approveUser(id: number, approve: boolean) {
  return this.http.put(
    `${this.baseUrl}/approve/${id}`,
    { approve },  // send as JSON object, not plain boolean
    this.getAuthHeaders() // attach token
  );
}



// restrictUser(userId: number, restrict: boolean) {
//   return this.http.put(`${this.baseUrl}/restrict/${userId}`, restrict, {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   });
// }

restrictUser(userId: number, restrict: boolean) {
  return this.http.put(
    `${this.baseUrl}/restrict/${userId}?restrict=${restrict}`,  // ✅ Add query parameter
    {},  // empty body since backend expects query param
    this.getAuthHeaders()
  );
}

// verifyOtp(email: string, otp: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp });
//   }

verifyOtp(email: string, otp: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp }, { responseType: 'text' });
}


setPasswordWithToken(token: string, newPassword: string): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/set-password-token`,
    { token, newPassword },
    { ...this.getAuthHeaders(), responseType: 'text' }
  );
}



// auth.service.ts
// auth.service.ts
addUser(data: { username: string; email: string; role: string }): Observable<string> {
  return this.http.post(
    `${this.baseUrl}/add-user`,
    data,
    { ...this.getAuthHeaders(), responseType: 'text' }
  );
}



//  requestPasswordReset(email: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/request-password-reset`, { email });
//   }

//   resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
//     return this.http.post(`${this.baseUrl}/reset-password`, { email, otp, newPassword });
//   }



 requestPasswordReset(email: string): Observable<string> {
    return this.http.post(this.baseUrl + '/request-password-reset', { email }, { responseType: 'text' });
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<string> {
    return this.http.post(this.baseUrl + '/reset-password', { email, otp, newPassword }, { responseType: 'text' });
  }









 private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    } catch (e) {
      return null;
    }
  }

  // getRole(): string | null {
  //   const token = this.token;
  //   if (!token) return null;
  //   const payload = this.decodeToken(token);
  //   return payload?.role || null; // assumes backend sets "role" claim
  // }


  getRole(): string | null {
  const token = this.token;
  if (!token) return null;
  const payload = this.decodeToken(token);

  return payload?.role 
      || payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
      || null;
}

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  
  }
  
  isUser(): boolean {
    return this.getRole() === 'User';
  }





}

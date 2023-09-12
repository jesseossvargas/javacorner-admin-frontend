import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService:AuthService, private router:Router) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(take(1), map(user =>{
      const isAuth = !!user;
      if(isAuth){
        if(user?.roles.includes(route.data['role'])) return true;
        if(user?.roles.includes('Admin')) return this.router.createUrlTree(['/courses']);
        if(user?.roles.includes('Instructor')) return this.router.createUrlTree(['/instructor-courses/' + user?.instructor?.instructorId]);
        if(user?.roles.includes('Student')) return this.router.createUrlTree(['/student-courses/' + user?.student?.studentId]);
      }
      return this.router.createUrlTree(['/auth']);
    }))
  }
}

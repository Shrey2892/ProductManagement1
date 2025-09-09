import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductUpdateComponent } from './components/product-update/product-update.component';
import { ProductDeleteComponent } from './components/product-delete/product-delete.component';
import { AuthGuard } from './guards/auth.guard';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RoleGuard } from './guards/role.guard';
import { NotAllowedComponent } from './components/not-allowed/not-allowed.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
//import { ResetPasswordComponent } from './components/reset-password/forgot-password';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent,canActivate: [AuthGuard] },
  {path:'cart', component:CartComponent, canActivate:[AuthGuard]},
  {path:'edit-profile', component:EditProfileComponent, canActivate:[AuthGuard]},
  { path: 'products/:id', component: ProductDetailComponent,canActivate: [AuthGuard]  },
  { path: 'create-product', component: ProductCreateComponent,canActivate: [AuthGuard,RoleGuard]  },
  { path: 'update-product/:id', component: ProductUpdateComponent ,canActivate: [AuthGuard,RoleGuard] },
  { path: 'delete-product/:id', component: ProductDeleteComponent,canActivate: [AuthGuard,RoleGuard]  },
  {path:'verify',component:VerifyOtpComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'forgot-password',component:ForgotPasswordComponent},
   { path: 'users', component: UserListComponent, canActivate:[AuthGuard,RoleGuard] } ,
  {path:'not-allowed', component:NotAllowedComponent},
  {path:'wishlist', component:WishlistComponent},
  { path: 'add-user', component: AddUserComponent, canActivate:[RoleGuard] },
  { path: 'set-password', component: SetPasswordComponent },
];

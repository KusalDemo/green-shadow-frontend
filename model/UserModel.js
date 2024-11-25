export class UserModel{
   constructor(email,password,role,roleClarificationCode){
       this.email = email;
       this.password = password;
       this.role = role;
       this.roleClarificationCode = roleClarificationCode;
   }

   getEmail() {
       return this.email;
   }

   getPassword() {
       return this.password;
   }

   getRole() {
       return this.role;
   }

   getRoleClarificationCode() {
       return this.roleClarificationCode;
   }

   setRole(role) {
       this.role = role;
   }

   setRoleClarificationCode(roleClarificationCode) {
       this.roleClarificationCode = roleClarificationCode;
   }

   setEmail(email) {
       this.email = email;
   }

   setPassword(password) {
       this.password = password;
   }
}
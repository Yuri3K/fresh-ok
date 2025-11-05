import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { combineLatest, filter, map, take } from "rxjs";

/**
 * Универсальный Role/Permission Guard для Angular
 * 
 * Поддерживает:
 * - проверку ролей пользователя (roles)
 * - проверку разрешений пользователя (permissions)
 * - режим проверки permissions: 'any' (хватает хотя бы одного) или 'all' (требуются все)
 * - перенаправление на /login или /403 при отсутствии доступа
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  const allowedRoles = route.data['roles'] as string[] | undefined
  const requiredPermissions = route.data['permissions'] as string[] | undefined

  // Бывают случаи, когда пользователь должен обладать всеми перечисленными правами ('all') или наоборот иметь хотя бы одно из требуемых разрешений ('any'). По умолчанию считаем, что 'any'
  const permissionsMode = route.data['permissionMode'] as 'any' | 'all' | undefined

  return combineLatest([
    auth.role$,
    auth.permissions$,
    auth.authInitializing$
  ]).pipe(
    filter(([,, initializing]) => !initializing),
    take(1),
    map(([role, permissions]) => {

      //Дополнительно проверяем авторизирован ли пользователь
      if (!auth.isAuthenticated()) {
        // Выполняем только редирект на страницу '/login'. Очистку authUserSubject 
        // и dbUserSubject выпонит свм AuthService в onAuthStateChanged
        return router.createUrlTree(['/login']);
      }

      // hasRole будет true в одном из следующих случаев:
      // 1. Для маршрута не указано ограничение по ролям (route.data['roles'] отсутствует) — значит доступ открыт для всех
      // 2. Ограничение указано, но список ролей пуст — значит доступ открыт для всех
      // 3. Роль текущего пользователя присутствует в списке разрешённых ролей
      const hasRole =
        !allowedRoles ||
        allowedRoles.length === 0 ||
        allowedRoles.includes(role!)

      // hasPermission будет true в одном из следующих случаев:
      // 1. Для маршрута не указано ограничение по permissions (route.data['permissions'] отсутствует)
      // 2. Ограничение указано, но список разрешений пуст — значит доступ открыт для всех
      // 3. Если permissionsMode = 'all' — пользователь должен иметь все указанные разрешения
      // 4. Если permissionsMode = 'any' или не указан — достаточно хотя бы одного совпадения
      const hasPermission =
        !requiredPermissions ||
        requiredPermissions.length === 0 ||
        (
          permissionsMode === 'all'
            ? requiredPermissions.every(p => permissions?.includes(p))
            : requiredPermissions.some(p => permissions?.includes(p))
        );

      // Если пользователь прошёл проверку по роли и разрешениям — разрешаем доступ
      if (hasRole && hasPermission) return true

      // В противном случае — редирект на страницу "Доступ запрещён"
      router.navigate(['/403'])
      return false
    })
  )
}
package com.rpgforge.infrastructure.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.rpgforge.domain.users.UserRole;
import com.rpgforge.infrastructure.users.UserAccountEntity;
import com.rpgforge.infrastructure.users.UserAccountRepository;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.context.request.NativeWebRequest;

class CurrentUserArgumentResolverTest {

    @Test
    void resolvesCurrentUserFromJwtPrincipal() throws Exception {
        UserAccountRepository repository = mock(UserAccountRepository.class);
        CurrentUserArgumentResolver resolver = new CurrentUserArgumentResolver(repository);
        NativeWebRequest webRequest = mock(NativeWebRequest.class);
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .claim("sub", "admin")
                .claim("user_id", "8fd2f0eb-a7f3-4be4-bb4d-1b1ea7c2ea34")
                .claim("username", "admin")
                .claim("roles", Set.of("ADMIN"))
                .claim("scope", "characters.read characters.write")
                .build();
        when(webRequest.getUserPrincipal()).thenReturn(new UsernamePasswordAuthenticationToken(jwt, null));

        CurrentUser currentUser = (CurrentUser) resolver.resolveArgument(currentUserParameter(), null, webRequest, null);

        assertThat(currentUser).isNotNull();
        assertThat(currentUser.username()).isEqualTo("admin");
        assertThat(currentUser.roles()).containsExactly("ADMIN");
        assertThat(currentUser.scopes()).containsExactlyInAnyOrder("characters.read", "characters.write");
    }

    @Test
    void resolvesCurrentUserFromUserRepositoryWhenPrincipalIsNotJwt() throws Exception {
        UserAccountRepository repository = mock(UserAccountRepository.class);
        CurrentUserArgumentResolver resolver = new CurrentUserArgumentResolver(repository);
        NativeWebRequest webRequest = mock(NativeWebRequest.class);

        UserAccountEntity userAccount = new UserAccountEntity();
        userAccount.setId(UUID.fromString("f01af0f6-6650-4f3d-ac95-3db342d426f0"));
        userAccount.setUsername("admin");
        userAccount.setEmail("admin@rpg-forge.local");
        userAccount.setPasswordHash("hash");
        userAccount.setRole(UserRole.ADMIN);
        userAccount.setCreatedAt(Instant.now());
        userAccount.setPermissions(Set.of("users.read", "characters.read"));

        when(webRequest.getUserPrincipal()).thenReturn(new UsernamePasswordAuthenticationToken("admin", null));
        when(repository.findByUsername("admin")).thenReturn(java.util.Optional.of(userAccount));

        CurrentUser currentUser = (CurrentUser) resolver.resolveArgument(currentUserParameter(), null, webRequest, null);

        assertThat(currentUser).isNotNull();
        assertThat(currentUser.id()).isEqualTo(userAccount.getId());
        assertThat(currentUser.username()).isEqualTo("admin");
        assertThat(currentUser.roles()).containsExactly("ADMIN");
        assertThat(currentUser.scopes()).containsExactlyInAnyOrder("users.read", "characters.read");
    }

    private MethodParameter currentUserParameter() throws NoSuchMethodException {
        return new MethodParameter(TestController.class.getDeclaredMethod("endpoint", CurrentUser.class), 0);
    }

    @SuppressWarnings("unused")
    private static final class TestController {
        void endpoint(CurrentUser currentUser) {
        }
    }
}

package ro.pizzeriaq.qservices.security;

import lombok.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class JwtAuthentication implements Authentication {

	private boolean isAuthenticated;
	private String issuer;
	private String subject;
	private List<? extends GrantedAuthority> authorities;
	private Date expiresAt;


	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}


	@Override
	public Object getCredentials() {
		return null;
	}


	@Override
	public Object getDetails() {
		return null;
	}


	@Override
	public Object getPrincipal() {
		return null;
	}


	@Override
	public boolean isAuthenticated() {
		return isAuthenticated;
	}


	@Override
	public void setAuthenticated(boolean isAuthenticated) {
		this.isAuthenticated = isAuthenticated;
	}


	@Override
	public String getName() {
		return subject;
	}
}

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export interface AuthUser {
  email: string;
  fullName: string;
  accountId: string;
  createdAt: number;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
  salt: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class AuthStore {
  private usersByEmail = new Map<string, StoredUser>();
  private tokens = new Map<string, string>(); // token -> email

  private hash(password: string, salt: string) {
    return scryptSync(password, salt, 64).toString("hex");
  }

  private issueToken(email: string): string {
    const token = randomBytes(24).toString("hex");
    this.tokens.set(token, email);
    return token;
  }

  register(email: string, password: string, fullName: string): { token: string; user: AuthUser } | { error: string } {
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) return { error: "Invalid email address." };
    if (password.length < 8) return { error: "Password must be at least 8 characters." };
    if (!fullName.trim()) return { error: "Full name is required." };
    if (this.usersByEmail.has(normalized)) return { error: "An account with this email already exists." };

    const salt = randomBytes(16).toString("hex");
    const accountId = `u_${randomBytes(4).toString("hex")}`;
    const user: StoredUser = { email: normalized, fullName: fullName.trim(), accountId, createdAt: Date.now(), passwordHash: this.hash(password, salt), salt };
    this.usersByEmail.set(normalized, user);
    const token = this.issueToken(normalized);
    const { passwordHash, salt: _s, ...publicUser } = user;
    return { token, user: publicUser };
  }

  login(email: string, password: string): { token: string; user: AuthUser } | { error: string } {
    const normalized = email.trim().toLowerCase();
    const user = this.usersByEmail.get(normalized);
    if (!user) return { error: "Invalid email or password." };
    const candidate = this.hash(password, user.salt);
    const a = Buffer.from(candidate, "hex");
    const b = Buffer.from(user.passwordHash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { error: "Invalid email or password." };
    const token = this.issueToken(normalized);
    const { passwordHash, salt, ...publicUser } = user;
    return { token, user: publicUser };
  }

  me(token: string): AuthUser | null {
    const email = this.tokens.get(token);
    if (!email) return null;
    const user = this.usersByEmail.get(email);
    if (!user) return null;
    const { passwordHash, salt, ...publicUser } = user;
    return publicUser;
  }

  logout(token: string) {
    this.tokens.delete(token);
  }
}

export const authStore = new AuthStore();

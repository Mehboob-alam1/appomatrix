<?php

declare(strict_types=1);

final class Auth
{
    public static function check(): bool
    {
        return !empty($_SESSION['admin_logged_in']);
    }

    public static function require(): void
    {
        if (!self::check()) {
            redirect('/admin/login');
        }
    }

    public static function attempt(string $username, string $password): bool
    {
        $user = (string) config('admin_username', 'admin');
        $pass = (string) config('admin_password', '');
        if ($pass === '') {
            return false;
        }
        if ($username === $user && hash_equals($pass, $password)) {
            $_SESSION['admin_logged_in'] = true;
            return true;
        }
        return false;
    }

    public static function logout(): void
    {
        unset($_SESSION['admin_logged_in']);
    }
}

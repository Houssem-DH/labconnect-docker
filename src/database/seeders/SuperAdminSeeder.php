<?php
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'email' => 'superadmin@gmail.com',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'password' => Hash::make('123456789'),
            'is_super_admin' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

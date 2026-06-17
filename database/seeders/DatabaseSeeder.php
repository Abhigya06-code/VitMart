<?php
namespace Database\Seeders;
 
use App\Models\{Category, User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
 
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default categories
        $categories = [
            'Books', 'Cycles', 'Electronics', 'Lab Equipment',
            'Hostel Essentials', 'Furniture', 'Sports', 'Others',
        ];
 
        foreach ($categories as $name) {
            Category::firstOrCreate(
                ['name' => $name],
                ['slug' => \Illuminate\Support\Str::slug($name)]
            );
        }
 
        // Admin account
        User::firstOrCreate(
            ['email' => 'admin@vit.ac.in'],
            [
                'name'               => 'Admin',
                'password'           => Hash::make('Admin@1234'),
                'role'               => 'admin',
                'email_verified_at'  => now(),
            ]
        );
 
        echo "✅ Default categories and admin user created.\n";
        echo "   Admin email: admin@vit.ac.in\n";
        echo "   Admin password: Admin@1234\n";
        echo "   ⚠️  Change the admin password after first login!\n";
    }
}
 
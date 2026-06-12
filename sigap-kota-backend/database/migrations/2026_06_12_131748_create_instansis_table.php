<?php

// database/migrations/xxxx_xx_xx_create_instansis_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instansis', function (Blueprint $table) {
            $table->id();

            // Identitas
            $table->string('nama');
            $table->enum('jenis', ['PUPR', 'BPBD', 'Dishub', 'Polisi', 'Kesehatan', 'Lainnya']);
            $table->string('kota')->nullable();
            $table->string('alamat')->nullable();

            // Akun
            $table->string('email')->unique();
            $table->string('password');

            // Kontak
            $table->string('penanggung_jawab')->nullable();
            $table->string('no_hp')->nullable();
            $table->string('whatsapp')->nullable();

            // Konfigurasi routing
            $table->boolean('kategori_jalan_rusak')->default(false);
            $table->boolean('kategori_bencana')->default(false);
            $table->boolean('kategori_lalu_lintas')->default(false);
            $table->unsignedTinyInteger('radius')->default(10); // km
            $table->string('jam_operasional')->default('24 Jam Penuh');

            // Status
            $table->boolean('aktif')->default(true);
            $table->boolean('ai_routing')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instansis');
    }
};
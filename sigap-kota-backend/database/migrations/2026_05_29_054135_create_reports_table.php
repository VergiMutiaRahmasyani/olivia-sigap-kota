<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_number')->unique(); // e.g. SGK-2024-001234
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');

            // Detail laporan
            $table->string('title');
            $table->text('description');
            $table->string('location_address');
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Status & prioritas
            $table->enum('status', [
                'menunggu',       // Baru masuk, belum diproses
                'diverifikasi',   // Sudah dicek admin
                'diproses',       // Sedang ditangani petugas
                'selesai',        // Perbaikan selesai
                'ditolak'         // Laporan tidak valid
            ])->default('menunggu');

            // AI Analysis
            $table->enum('severity', ['ringan', 'sedang', 'parah'])->nullable();
            $table->decimal('severity_score', 5, 2)->nullable(); // 0.00 - 100.00
            $table->text('ai_analysis')->nullable();             // Penjelasan AI
            $table->boolean('ai_analyzed')->default(false);

            // Feedback & rating
            $table->tinyInteger('rating')->nullable();  // 1-5 dari warga setelah selesai
            $table->text('feedback')->nullable();

            // Catatan admin/petugas
            $table->text('admin_notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'severity']);
            $table->index(['user_id', 'created_at']);
            $table->index(['kecamatan', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
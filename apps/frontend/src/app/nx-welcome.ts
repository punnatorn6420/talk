import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-nx-welcome',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TagModule,
    ChipModule,
    DividerModule,
  ],
  template: `<div class="min-h-screen bg-slate-100 px-6 py-10">
    <div class="mx-auto max-w-6xl space-y-8">
      <div class="text-center">
        <p
          class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600"
        >
          Angular + PrimeNG + Tailwind
        </p>
        <h1 class="text-4xl font-bold tracking-tight text-slate-900">
          UI Test Page
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
          ใช้หน้านี้เช็กว่า PrimeNG component และ Tailwind utility class render
          ได้ปกติ
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <p-card>
          <ng-template pTemplate="header">
            <div
              class="rounded-t-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-4 text-white"
            >
              <h2 class="text-xl font-semibold">PrimeNG Components</h2>
              <p class="mt-1 text-sm text-white/90">
                ถ้าส่วนนี้ขึ้นสวย แปลว่า PrimeNG ใช้งานได้
              </p>
            </div>
          </ng-template>

          <div class="space-y-5 p-1">
            <div>
              <input
                pInputText
                class="w-full"
                placeholder="PrimeNG input text"
              />
            </div>

            <div class="flex flex-wrap gap-3">
              <p-button label="Primary Button" icon="pi pi-check"></p-button>

              <p-button
                label="Secondary"
                icon="pi pi-star"
                severity="secondary"
                [outlined]="true"
              ></p-button>
            </div>

            <p-divider></p-divider>

            <div class="flex flex-wrap gap-2">
              <p-chip label="PrimeNG"></p-chip>
              <p-chip label="Tailwind"></p-chip>
              <p-tag severity="success" value="Ready"></p-tag>
              <p-tag severity="warn" value="Testing"></p-tag>
            </div>
          </div>
        </p-card>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900">
              Tailwind Layout
            </h2>
            <span
              class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
            >
              Active
            </span>
          </div>

          <div class="space-y-4">
            <div class="rounded-xl bg-slate-50 p-4">
              <p class="text-sm text-slate-500">Typography</p>
              <p class="mt-1 text-lg font-semibold text-slate-900">
                Tailwind utility classes should apply here
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-sm text-slate-500">
                Spacing / Border / Radius / Shadow
              </p>
              <p class="mt-1 font-medium text-slate-900">
                ถ้ากล่องนี้มีระยะห่าง สีพื้น ขอบมน และเงา แปลว่า Tailwind ใช้ได้
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-yellow-50 p-4">
                <p class="text-sm font-medium text-yellow-700">Card A</p>
                <p class="mt-1 text-sm text-yellow-600">
                  Testing color utility
                </p>
              </div>

              <div class="rounded-xl bg-sky-50 p-4">
                <p class="text-sm font-medium text-sky-700">Card B</p>
                <p class="mt-1 text-sm text-sky-600">Testing grid layout</p>
              </div>

              <div class="rounded-xl bg-emerald-50 p-4">
                <p class="text-sm font-medium text-emerald-700">Card C</p>
                <p class="mt-1 text-sm text-emerald-600">
                  Testing responsive spacing
                </p>
              </div>

              <div class="rounded-xl bg-rose-50 p-4">
                <p class="text-sm font-medium text-rose-700">Card D</p>
                <p class="mt-1 text-sm text-rose-600">Testing visual style</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {}

// 'use server';

// import * as pdf from 'pdf-parse';
// import { flashSet } from '@/lib/actions/flash';
// import { ActionResult } from '@/@types/global';
// import { redirect, RedirectType } from 'next/navigation';
// import { auth } from '@/lib/actions/auth';
// import { prisma } from '@/lib/prisma';
// import { getOption } from '@/utils/option';
// import { Majors } from '@/data/majors';
// import { Faculties } from '@/data/faculties';

// export async function uploadKrs(fd: FormData) {
//   const session = await auth();

//   try {
//     const krs = fd.get('krs');

//     if (!krs || !(krs instanceof File)) {
//       throw new Error('File KRS wajib diunggah');
//     }

//     if (krs.type !== 'application/pdf') {
//       throw new Error('File harus berupa PDF');
//     }

//     if (krs.size > 5 * 1024 * 1024) {
//       throw new Error('Ukuran maksimal 5MB');
//     }

//     const buffer = Buffer.from(await krs.arrayBuffer());
//     const parsed = new pdf.PDFParse({ data: buffer });
//     const input = await parsed.getText();

//     if (
//       !input?.pages ||
//       !Array.isArray(input.pages) ||
//       input.pages.length === 0
//     )
//       throw new Error('KRS tidak valid');

//     let text = input.pages[0]?.text;
//     if (typeof text !== 'string') throw new Error('KRS tidak valid');

//     text = text
//       .replace(/\r\n?/g, '\n')
//       .replace(/\t+/g, ' ')
//       .replace(/ +/g, ' ')
//       .trim();

//     const prefix =
//       'KEMENTERIAN AGAMA\n' +
//       'UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG\n' +
//       'Jalan A.H. Nasution No. 105 Cibiru - Bandung\n' +
//       'Telp. (022) 7802276 Fax. (022) 7802276';

//     if (!text.includes(prefix)) throw new Error('KRS tidak valid');

//     const start = text.indexOf('KARTU RENCANA STUDI');
//     const snippet = start >= 0 ? text.slice(start) : text;

//     const rx =
//       /Nama\s*:\s*(.+?)\s*Program Studi\s*:\s*[^\n]*\nNIM\s*:\s*(.+?)\s*Ip Semester Lalu\s*:\s*[^\n]*/i;

//     const m = snippet.match(rx);
//     if (!m) throw new Error('KRS tidak valid');

//     const name = m[1].trim(),
//       nim = m[2].trim();

//     if (nim.length != 10) throw new Error('KRS tidak valid');

//     const cohort = nim.slice(1, 3),
//       degree = 'S' + nim[0],
//       major = getOption(Majors, nim.slice(3, 6)),
//       faculty = getOption(Faculties, major?.meta?.facultyId ?? '');

//     const data = {
//       name,
//       nim,
//       cohort,
//       degree,
//       major: major?.value,
//       faculty: faculty?.value,
//     };

//     await prisma.scholar.upsert({
//       where: { userId: session.user.id },
//       create: { userId: session.user.id, ...data },
//       update: { ...data },
//     });

//     await parsed.destroy();

//     await flashSet({
//       success: true,
//       message: 'Profil mahasiswa berhasil diperbarui',
//     } as ActionResult);
//   } catch (err: any) {
//     await flashSet({
//       success: false,
//       message: err.message || 'Terjadi masalah',
//     } as ActionResult);
//     redirect('/profil/unggah-krs', RedirectType.replace);
//   }

//   redirect('/profil');
// }

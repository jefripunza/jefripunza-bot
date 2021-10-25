/*
    nama   : Mutiara Putri Mayandita
    kelas  : Teknik Informatika 5
    matkul : Algoritma

header output ada 2

#include<iostream>
cara print nya menggunakan syntax = cout<<"value";

#include <stdio.h>
cara print nya menggunakan syntax = printf("value");

output yang saya pilih adalah...
*/
#include <stdio.h>

/*
header tambahan
untuk menggunakan Sleep & scanf
*/
#include <windows.h>

/* type variabel
    const   = nilainya konstan / tidak dapat berubah
    long    = 4543545443 (minimal -2,147,483,648 maximal 2,147,483,647)
*/

/* type data
    integer = 17 (nilai bulat)
    float   = 8.1945 (nilai desimal)
    String  = "merdeka123" (alfabet|number) ( ' " )
    boolean = true | false (nilai nya cuman 2)
    Array   = [1, 2, 3] (list data yang banyak)
    Object  = {nama: "Mutiara Putri Mayandita"} (nilai berbasis field key untuk memanggil value)
*/

int main()
{
        /*
        \n adalah sebuah enter

        perkenalkan saya...
        */
        printf("nama  : Mutiara Putri Mayandita\n"); // print nama
        printf("kelas : Teknik Informatika 5\n\n");  // print kelas

        // ======================================================================================
        // ==================================== main process ====================================
        // ======================================================================================

        printf("\n# contoh 1\n");
        int b = 18;                                                            // tanggal lahir
        int c = 10;                                                            // bulan lahir
        printf("jika nilai b : %d dan nilai c : %d \n", b, c);                 // definisi print
        int a = b + c;                                                         // kalkulasi
        printf("dengan mengunakan rumus a = b + c ? maka nilai a : %d \n", a); // output dari variabel a

        // ======================================================================================

        printf("\n# contoh 2\n");
        int x = 20;                                                            // tahun lahir 2 angka depan
        int Z = 2;                                                             // tahun lahir 2 angka belakang (jika angka depan adalah 0 ? maka dihilangkan karena nanti error)
        printf("jika nilai x : %d dan nilai Z : %d \n", x, Z);                 // definisi print
        int B = x * Z;                                                         // kalkulasi
        printf("dengan mengunakan rumus B = x * Z ? maka nilai B : %d \n", B); // output dari variabel B
        int A = 6;                                                             // nomor keberuntungan saya
        printf("dan jika nilai A : %d \n", A);                                 // definisi print
        int Y = A + B;                                                         // kalkulasi
        printf("dengan mengunakan rumus Y = A + B ? maka nilai Y : %d \n", Y); // output dari variabel Y

        // ======================================================================================

        printf("\n# contoh 3\n");
        /*
        ceritanya si anu pengen beli stok alat kosmetik (gucoy)
        */
        int harga = 300000;                                                             // menulis harga dihitung jumlah 0 nya yaaaaa
        int jumlah_barang = 10;                                                         // jumlah stok kosmetik yang ingin dibeli
        printf("jika harga : %d ribu dan jumlah barang : %d \n", harga, jumlah_barang); // definisi print
        int total_harga = harga * jumlah_barang;                                        // yang harus dibayar oleh si anu
        printf("dengan mengunakan rumus total_harga = harga * jumlah_barang ?\n");
        printf("maka nilai total_harga : %d ribu \n", total_harga); // output dari variabel total_harga
        int diskon = total_harga * 10 / 100;                        // diskon yang didapatkan si anu
        printf("lalu ternyata mendapatkan diskon 10 persen \n");
        printf("dari total harga yaitu potongan %d ribu \n", diskon);          // print diskon
        int pembayaran = total_harga - diskon;                                 // kalkulasi pembayaran
        printf("maka harga yang harus dibayarkan adalah : %d \n", pembayaran); // harga yang didapatkan oleh si anu

        // ======================================================================================

        printf("\n# contoh 4\n");
        int Q, R, S; // definisi awal untuk nilai input nanti
        printf(" Q : ");
        scanf("%d", &Q); // input Q

        printf(" R : ");
        scanf("%d", &R); // input R

        printf(" S : ");
        scanf("%d", &S); // input S

        int P = (Q * (R + S)) + (R * (Q + S)); // kalkulasi
        printf("dengan menggunakan rumus P = Q(R+S) + R(Q+S) \n");
        printf("maka P : %d \n", P); // print output P

        // ======================================================================================

        printf("\n# contoh 5\n");
        int r = 6;
        int s = 4;
        printf("jika nilai r : %d dan nilai s : %d \n", r, s);
        int q = r + s;
        printf("dengan menggunakan rumus q : r + s ? maka nilai q : %d \n", q);
        int p = q * r;
        printf("dengan menggunakan rumus p : q * r ? maka nilai p : %d \n", p);

        // ======================================================================================

        printf("\n# contoh 6\n");
        int a_luas = 18;
        int t_luas = 12;
        printf("jika nilai a : %d dan nilai t : %d \n", a_luas, t_luas);
        int luas_segitiga = a_luas * t_luas * 1 / 2;
        printf("jadi luas segitiga siku-siku adalah %d \n", luas_segitiga);

        // ======================================================================================

        printf("\n# contoh 7\n");
        float phi = 3.14;
        int r_lingkaran = 14;
        printf("Jika nilai phi : %4.2f dan nilai r : %d \n", phi, r_lingkaran);
        float luas_lingkaran = phi * r_lingkaran * r;
        printf("jadi luas lingkaran adalah %4.2f \n", luas_lingkaran);

        // ======================================================================================

        printf("\n# contoh 8\n");
        int p_volume = 14;
        int l = 6;
        int t = 8;
        printf("p : %d \n", p_volume);
        printf("l : %d \n", l);
        printf("t : %d \n", t);
        int volume = p * l * t;
        printf("maka volume : %d \n", volume);

        // ======================================================================================

        printf("\n\n30 detik kemudian...");
        Sleep(1 * 1000);
        printf("\n\naku hilang :v");
        Sleep(30 * 1000);
        // and close...
}
This assignment is for Devscale full-stack bootcamp submission led by @indrazm

# :star: Assignment briefs

Briefs dari assignment ini sederhana, buat api database (tanpa relationship) + api CRUD endpoint nya.
tapi gue coba buat push diri sendiri agak ke tepi jurang, jadi gue tambahin beberapa requirement yang diluar briefs assignment awal. Jujur menantang juga karena meskipun gue pernah implementasi dari awal by following youtube 5+ hours tutorial, gue masih sangat early kalau buat dari scratch. jadi dalam proses nya nabrak sana nabrak sini, tapi ya bisa juga akhirnya. ditambah gue bisa belajar banyak mulai dari setup project s.d. exploring prisma + hono.

```
initial spec
------------------------
Buat API endpoint untuk Eventmaker. 
> Table Events
> Table Participants
> Pakai Hono + Prisma + Sqlite
```

```
my spec
------------------------
...prev
+ Table Users, Tickets, Bookings, Events
+ Implement table relations with prisma
+ Use hono rpc

```

# 🥇 Wins
- [x] Bisa setup project include setting prisma (migrate, generate, etc)
- [x] Bisa buat relationship di prisma, termasuk buat query nya di endpoints
- [x] Bisa setup hono RPC
- [x] Learn some github : basic push, remote, branching, etc

# ⛰️ Challenges
- [ ] <sup>1</sup> Static typing is hard, i don't even know wkwk. Coba buat bikin utils function buat saving time handling validation error, tapi kena omel linter karena ga tau static typing nya function argument di zValidator. Ga ada types yang bisa di import dari zod yang bisa langsung instan pakai.
- [ ] <sup>2</sup> Still don't know cara query yg best practice. di bookings endpoint coba implementasi query buat dapetin tipe tiket yang di cancel (vip ticket, etc), works but rasanya bertele tele. Kalau ga karena konsul ke gpt ga tau kalau di ORM bisa begini dan begitu buat query. masih banyak basic querying di ORM yang belum tau.
- [ ] <sup>3</sup> Technically berhasil query create buat m-n relationship, tapi masih belum paham betul why it works. it's just works 🥲
- [ ] <sup>4</sup> Gue coba implement frontend (as you can see on the other branch), tapi masih belum sukses. Ga tau terutama di cara bundling client / server. mau riset<sup>2</sup> lagi for next few days.

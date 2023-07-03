using api.Dao;
using api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// enable CORS // extra 
builder.Services.AddCors(c => 
{
    c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// JSON serializer // extra 
builder.Services.AddControllersWithViews().AddNewtonsoftJson(
    options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
    ).AddNewtonsoftJson(
    options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// extra 
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Token"])),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});


builder.Services.AddSingleton<IAdminDao, AdminDao>();
builder.Services.AddSingleton<IUnitDao, UnitDao>();
builder.Services.AddSingleton<IStaffDao, StaffDao>();
builder.Services.AddSingleton<IStudentDao, StudentDao>();
builder.Services.AddSingleton<IAppointmentDao, AppointmentDao>();
//builder.Services.AddSingleton(new DBService(builder.Configuration)); // extra 
builder.Services.AddSingleton<DBService>();
builder.Services.AddSingleton<ICommonAction, CommonAction>();




var app = builder.Build();


app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication(); // extra
app.UseAuthorization();

app.MapControllers();

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(
//                   Path.Combine(Directory.GetCurrentDirectory(), "Photos")),
//    RequestPath = "/Photos"
//});



app.Run();

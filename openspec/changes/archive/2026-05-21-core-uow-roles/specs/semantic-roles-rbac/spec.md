## ADDED Requirements

### Requirement: Rol usa clave primaria semántica

La entidad `Rol` SHALL identificarse mediante una clave primaria semántica `codigo` de tipo VARCHAR(20), con valores del dominio `ADMIN`, `STOCK`, `PEDIDOS` y `CLIENT`. El `Rol` NO SHALL usar una clave primaria numérica autoincremental.

#### Scenario: Modelo Rol define codigo como PK

- **WHEN** se inspecciona el modelo `Rol` en `backend/models/usuario.py`
- **THEN** `codigo` es la clave primaria (VARCHAR(20))
- **AND** no existe un campo `id` numérico autoincremental
- **AND** el conjunto de valores válidos de `codigo` es `ADMIN`, `STOCK`, `PEDIDOS`, `CLIENT`

#### Scenario: Roles consistentes entre entornos

- **WHEN** se siembran los roles en dos entornos distintos (por ejemplo dev y producción)
- **THEN** cada rol tiene el mismo `codigo` en ambos entornos
- **AND** la identidad de un rol no depende de un ID arbitrario asignado por la base de datos

### Requirement: UsuarioRol referencia la clave semántica de Rol

La pivot `UsuarioRol` SHALL relacionar usuarios y roles mediante una clave primaria compuesta `(usuario_id, rol_codigo)`, donde `rol_codigo` es una clave foránea (VARCHAR(20)) hacia `roles.codigo`.

#### Scenario: Pivot define rol_codigo como FK

- **WHEN** se inspecciona el modelo `UsuarioRol` en `backend/models/usuario.py`
- **THEN** la PK compuesta es `(usuario_id, rol_codigo)`
- **AND** `rol_codigo` es FK a `roles.codigo` (VARCHAR(20))
- **AND** no existe un campo `rol_id` numérico

#### Scenario: get_roles devuelve los códigos de rol del usuario

- **WHEN** se consultan los roles de un usuario vía `UsuarioRepository.get_roles(usuario_id)`
- **THEN** el join se realiza por `UsuarioRol.rol_codigo == Rol.codigo`
- **AND** el resultado es una `list[str]` con los códigos de rol (por ejemplo `["ADMIN", "STOCK"]`)

#### Scenario: require_role autoriza por código de rol

- **WHEN** un endpoint protegido por `require_role([...])` recibe una request de un usuario
- **THEN** la comparación se hace entre los códigos de rol del usuario y los códigos permitidos
- **AND** el acceso se concede si hay al menos un código en común, sin depender de IDs numéricos

### Requirement: El seed inserta roles por código

Los procesos de seed (`backend/seed.py` y `seed_initial_data` en `auth_service.py`) SHALL insertar los roles del sistema usando su `codigo` semántico y SHALL asociar los usuarios a roles mediante `rol_codigo`, de forma idempotente.

#### Scenario: Seed crea los roles fijos por codigo

- **WHEN** se ejecuta el seed sobre una base de datos sin roles
- **THEN** se crean los roles con `codigo` `ADMIN`, `STOCK`, `PEDIDOS` y `CLIENT`
- **AND** cada rol se identifica por su `codigo`, no por un id numérico

#### Scenario: Seed asocia usuarios por rol_codigo

- **WHEN** el seed crea los usuarios por defecto (admin y cliente)
- **THEN** las asociaciones se insertan como `UsuarioRol(usuario_id=..., rol_codigo=...)`
- **AND** el usuario admin queda asociado a `ADMIN`, `STOCK`, `PEDIDOS`
- **AND** el usuario cliente queda asociado a `CLIENT`

#### Scenario: Seed es idempotente

- **WHEN** el seed se ejecuta más de una vez sobre la misma base de datos
- **THEN** no se duplican roles ni asociaciones `UsuarioRol`
- **AND** los roles existentes se reconocen por su `codigo`

### Requirement: El registro asigna el rol CLIENT por código

El flujo de registro (`AuthService.register`) SHALL asignar el rol por defecto al nuevo usuario referenciando el `codigo` `CLIENT` en lugar de buscar y usar un id numérico de rol.

#### Scenario: Nuevo usuario recibe rol CLIENT

- **WHEN** un usuario se registra con éxito
- **THEN** se crea una asociación `UsuarioRol(usuario_id=usuario.id, rol_codigo="CLIENT")`
- **AND** la asignación no depende de resolver un id numérico de rol

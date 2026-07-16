package com.univo.backend_app.models;

public class TareaDTO {
    private String codigo;
    private String nombre;
    private String estado;
    private String responsable;
    private String prioridad;

    public TareaDTO() {
    }

    public TareaDTO(String codigo, String nombre, String estado, String responsable, String prioridad) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.estado = estado;
        this.responsable = responsable;
        this.prioridad = prioridad;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }
}

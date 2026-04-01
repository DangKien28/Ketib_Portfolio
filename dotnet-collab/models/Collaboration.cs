// File: Models/Collaboration.cs
using System;

namespace dotnet_collab.Models
{
    public class Collaboration
    {
        public Guid Id { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string ProjectType { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string? ClientNotes { get; set; }
        public decimal? ProposedPrice { get; set; }
        public decimal? FinalCost { get; set; }
        public string Status { get; set; } = "REQUESTED";
        public string? AdminNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}